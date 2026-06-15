import { getLatestDeckAnalysis } from "@/features/deck-analyses/deck-analyses.service";
import { requireUserId } from "@/lib/auth/require-user";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await context.params;
    const latest = await getLatestDeckAnalysis(userId, id);

    if (!latest) {
      return Response.json({ error: "Analysis not found" }, { status: 404 });
    }

    return Response.json(latest);
  } catch (err) {
    if (err instanceof Response) return err;
    const message = err instanceof Error ? err.message : "Failed to load analysis";
    return Response.json({ error: message }, { status: 500 });
  }
}
