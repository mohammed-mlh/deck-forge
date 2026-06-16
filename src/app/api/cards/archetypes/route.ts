import { getArchetypes } from "@/features/cards/cards.service";

export async function GET() {
  try {
    const archetypes = await getArchetypes();
    return Response.json({ archetypes });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load archetypes";
    return Response.json({ error: message }, { status: 500 });
  }
}
