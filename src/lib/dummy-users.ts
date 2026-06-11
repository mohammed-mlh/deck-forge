import type { DummyAccount } from "@/types/auth";

export const DUMMY_ACCOUNTS: DummyAccount[] = [
  {
    id: "duelist-1",
    name: "Duelist",
    email: "duelist@deckforge.com",
    password: "demo123",
  },
  {
    id: "pro-1",
    name: "Pro Player",
    email: "pro@deckforge.com",
    password: "demo123",
  },
];

export const DEFAULT_DUMMY_ACCOUNT = DUMMY_ACCOUNTS[0];

export function findDummyAccount(email: string): DummyAccount | undefined {
  return DUMMY_ACCOUNTS.find(
    (account) => account.email.toLowerCase() === email.trim().toLowerCase()
  );
}
