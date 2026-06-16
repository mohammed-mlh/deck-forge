import { getArchetypeById } from "@/features/archetypes/archetypes.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const archetypeId = Number.parseInt(id, 10);
    if (!Number.isFinite(archetypeId) || archetypeId <= 0) {
      return Response.json({ error: "Invalid archetype id" }, { status: 400 });
    }

    const archetype = await getArchetypeById(archetypeId);
    if (!archetype) {
      return Response.json({ error: "Archetype not found" }, { status: 404 });
    }

    return Response.json({ archetype });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load archetype";
    return Response.json({ error: message }, { status: 500 });
  }
}
