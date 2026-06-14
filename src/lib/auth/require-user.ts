import { auth } from "@clerk/nextjs/server";

export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return userId;
}
