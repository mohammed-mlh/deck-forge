import type { DeckFormatId, ParsedCardRef, ParsedDeckList } from "@/types/deck-io";
import type { DeckZone } from "@/types/deck";

function emptyParsed(): ParsedDeckList {
  return { main: [], extra: [], side: [] };
}

function mergeRefs(refs: Omit<ParsedCardRef, "quantity">[]): ParsedCardRef[] {
  const map = new Map<string, ParsedCardRef>();
  for (const ref of refs) {
    const key = ref.id ? `id:${ref.id}` : `name:${ref.name?.toLowerCase() ?? ""}`;
    if (!key || key === "name:") continue;
    const existing = map.get(key);
    if (existing) existing.quantity += 1;
    else map.set(key, { ...ref, quantity: 1 });
  }
  return [...map.values()];
}

function parseZonedContent(
  lines: string[],
  parseLine: (line: string) => Omit<ParsedCardRef, "quantity"> | null
): ParsedDeckList {
  const buckets: Record<DeckZone, Omit<ParsedCardRef, "quantity">[]> = {
    main: [],
    extra: [],
    side: [],
  };
  let zone: DeckZone = "main";

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const lower = line.toLowerCase();
    if (lower === "#main") {
      zone = "main";
      continue;
    }
    if (lower === "#extra") {
      zone = "extra";
      continue;
    }
    if (lower === "!side" || lower === "#side") {
      zone = "side";
      continue;
    }

    const ref = parseLine(line);
    if (ref) buckets[zone].push(ref);
  }

  return {
    main: mergeRefs(buckets.main),
    extra: mergeRefs(buckets.extra),
    side: mergeRefs(buckets.side),
  };
}

function parseIdLine(line: string): Omit<ParsedCardRef, "quantity"> | null {
  const id = Number.parseInt(line.trim(), 10);
  if (!Number.isFinite(id) || id <= 0) return null;
  return { id };
}

function parseNameLine(line: string): Omit<ParsedCardRef, "quantity"> | null {
  const name = line.trim();
  if (!name || name.startsWith("#") || name.startsWith("!")) return null;
  return { name };
}

export function parseYgoprodeckTxt(content: string): ParsedDeckList {
  return parseZonedContent(content.split(/\r?\n/), parseNameLine);
}

export function parseYdk(content: string): ParsedDeckList {
  return parseZonedContent(content.split(/\r?\n/), parseIdLine);
}

function decodeYdkeSection(encoded: string): Omit<ParsedCardRef, "quantity">[] {
  if (!encoded.trim()) return [];
  try {
    const decoded = atob(encoded.trim());
    return decoded
      .split(",")
      .map((part) => Number.parseInt(part.trim(), 10))
      .filter((id) => Number.isFinite(id) && id > 0)
      .map((id) => ({ id }));
  } catch {
    return [];
  }
}

export function parseYdke(content: string): ParsedDeckList {
  const trimmed = content.trim();
  const payload = trimmed.startsWith("ydke://") ? trimmed.slice(7) : trimmed;
  const [mainB64 = "", extraB64 = "", sideB64 = ""] = payload.split("!");

  return {
    main: mergeRefs(decodeYdkeSection(mainB64)),
    extra: mergeRefs(decodeYdkeSection(extraB64)),
    side: mergeRefs(decodeYdkeSection(sideB64)),
  };
}

type PortableZone = { id: number; quantity: number }[];

function parsePortableZone(raw: unknown): ParsedCardRef[] {
  if (!Array.isArray(raw)) return [];
  const refs: ParsedCardRef[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const id = Number((entry as { id?: unknown }).id);
    const qty = Number(
      (entry as { quantity?: unknown; qty?: unknown }).quantity
        ?? (entry as { qty?: unknown }).qty ?? 1
    );
    if (!Number.isFinite(id) || id <= 0) continue;
    refs.push({ id, quantity: Math.max(1, qty) });
  }
  return refs;
}

export function parseJsonPortable(content: string): ParsedDeckList {
  const data = JSON.parse(content) as Record<string, unknown>;
  return {
    name: typeof data.name === "string" ? data.name : undefined,
    main: parsePortableZone(data.main),
    extra: parsePortableZone(data.extra),
    side: parsePortableZone(data.side),
  };
}

export function parseJsonFull(content: string): ParsedDeckList {
  const data = JSON.parse(content) as Record<string, unknown>;
  const toRefs = (zone: unknown): ParsedCardRef[] => {
    if (!Array.isArray(zone)) return [];
    const refs: ParsedCardRef[] = [];
    for (const entry of zone) {
      if (!entry || typeof entry !== "object") continue;
      const card = (entry as { card?: { id?: number; name?: string } }).card;
      const qty = Number((entry as { quantity?: number }).quantity ?? 1);
      if (card?.id) refs.push({ id: card.id, quantity: Math.max(1, qty) });
      else if (card?.name) refs.push({ name: card.name, quantity: Math.max(1, qty) });
    }
    return refs;
  };

  return {
    name: typeof data.name === "string" ? data.name : undefined,
    main: toRefs(data.main),
    extra: toRefs(data.extra),
    side: toRefs(data.side),
  };
}

function parseDelimitedRows(
  content: string,
  delimiter: string
): ParsedDeckList {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return emptyParsed();

  const refs: Record<DeckZone, ParsedCardRef[]> = { main: [], extra: [], side: [] };
  const header = lines[0].toLowerCase();
  const hasHeader = header.includes("zone");
  const start = hasHeader ? 1 : 0;

  for (let i = start; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < 2) continue;

    let zone: DeckZone = "main";
    let id: number | undefined;
    let name: string | undefined;
    let quantity = 1;

    if (hasHeader) {
      const z = cols[0]?.toLowerCase();
      if (z === "extra" || z === "side" || z === "main") zone = z;
      id = Number.parseInt(cols[1] ?? "", 10);
      name = cols[2] || undefined;
      quantity = Number.parseInt(cols[3] ?? "1", 10) || 1;
    } else {
      id = Number.parseInt(cols[0] ?? "", 10);
      name = cols[1] || undefined;
      quantity = Number.parseInt(cols[2] ?? "1", 10) || 1;
    }

    const ref: ParsedCardRef = {
      quantity: Math.max(1, quantity),
      ...(Number.isFinite(id) && id! > 0 ? { id: id! } : {}),
      ...(name ? { name } : {}),
    };
    if (ref.id || ref.name) refs[zone].push(ref);
  }

  return {
    main: mergeQuantityRefs(refs.main),
    extra: mergeQuantityRefs(refs.extra),
    side: mergeQuantityRefs(refs.side),
  };
}

function mergeQuantityRefs(refs: ParsedCardRef[]): ParsedCardRef[] {
  const map = new Map<string, ParsedCardRef>();
  for (const ref of refs) {
    const key = ref.id ? `id:${ref.id}` : `name:${ref.name?.toLowerCase()}`;
    const existing = map.get(key);
    if (existing) existing.quantity += ref.quantity;
    else map.set(key, { ...ref });
  }
  return [...map.values()];
}

export function parseCsv(content: string): ParsedDeckList {
  return parseDelimitedRows(content, ",");
}

export function parseTsv(content: string): ParsedDeckList {
  return parseDelimitedRows(content, "\t");
}

export function parseXml(content: string): ParsedDeckList {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid XML");

  const deckEl = doc.querySelector("deck");
  const name = deckEl?.getAttribute("name") ?? undefined;

  const readZone = (zone: DeckZone): ParsedCardRef[] => {
    const refs: ParsedCardRef[] = [];
    doc.querySelectorAll(`${zone} card, ${zone} > card, zone[name="${zone}"] card`).forEach((el) => {
      const id = Number.parseInt(el.getAttribute("id") ?? "", 10);
      const nameAttr = el.getAttribute("name") ?? el.textContent?.trim();
      const qty = Number.parseInt(el.getAttribute("qty") ?? el.getAttribute("quantity") ?? "1", 10) || 1;
      if (Number.isFinite(id) && id > 0) refs.push({ id, quantity: qty });
      else if (nameAttr) refs.push({ name: nameAttr, quantity: qty });
    });
    return mergeQuantityRefs(refs);
  };

  return {
    name,
    main: readZone("main"),
    extra: readZone("extra"),
    side: readZone("side"),
  };
}

export function parsePlainIds(content: string): ParsedDeckList {
  const ids = content
    .split(/[\s,;]+/)
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((id) => Number.isFinite(id) && id > 0)
    .map((id) => ({ id }));

  return { main: mergeRefs(ids), extra: [], side: [] };
}

export function parsePlainNames(content: string): ParsedDeckList {
  const names = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((name) => ({ name }));

  return { main: mergeRefs(names), extra: [], side: [] };
}

export function detectDeckFormat(content: string, filename?: string): DeckFormatId {
  const ext = filename?.split(".").pop()?.toLowerCase();
  const trimmed = content.trim();

  if (trimmed.startsWith("ydke://") || ext === "ydke") return "ydke";
  if (ext === "ydk") return "ydk";
  if (ext === "xml" || trimmed.startsWith("<?xml") || trimmed.startsWith("<deck")) return "xml";
  if (ext === "csv") return "csv";
  if (ext === "tsv") return "tsv";
  if (ext === "ids") return "plain-ids";
  if (ext === "names") return "plain-names";

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const data = JSON.parse(trimmed) as Record<string, unknown>;
      if (Array.isArray(data.main) && data.main[0] && typeof data.main[0] === "object") {
        const first = data.main[0] as Record<string, unknown>;
        if ("card" in first) return "json-full";
      }
      return "json-portable";
    } catch {
      return "json-portable";
    }
  }

  if (/#main/i.test(trimmed)) {
    const bodyLines = trimmed.split(/\r?\n/).filter((l) => {
      const t = l.trim().toLowerCase();
      return t && t !== "#main" && t !== "#extra" && t !== "!side" && t !== "#side";
    });
    const first = bodyLines[0]?.trim() ?? "";
    if (/^\d+$/.test(first)) return "ydk";
    return "ygoprodeck-txt";
  }

  if (trimmed.includes("\t")) return "tsv";
  if (/^zone,/im.test(trimmed) || /^main,/im.test(trimmed)) return "csv";

  if (/^[\d,\s;]+$/.test(trimmed)) return "plain-ids";

  return "plain-names";
}

export function parseDeckContent(
  content: string,
  format: DeckFormatId,
  filename?: string
): ParsedDeckList {
  switch (format) {
    case "ygoprodeck-txt":
      return parseYgoprodeckTxt(content);
    case "ydk":
      return parseYdk(content);
    case "ydke":
      return parseYdke(content);
    case "json-portable":
      return parseJsonPortable(content);
    case "json-full":
      return parseJsonFull(content);
    case "csv":
      return parseCsv(content);
    case "tsv":
      return parseTsv(content);
    case "xml":
      return parseXml(content);
    case "plain-ids":
      return parsePlainIds(content);
    case "plain-names":
      return parsePlainNames(content);
    default:
      return emptyParsed();
  }
}
