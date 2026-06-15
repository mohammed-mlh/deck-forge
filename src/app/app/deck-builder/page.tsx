import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

export default function NewDeckBuilderPage() {
  redirect(`/app/deck-builder/${randomUUID()}`);
}
