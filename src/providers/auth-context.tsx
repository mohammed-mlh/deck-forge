"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { findDummyAccount, DEFAULT_DUMMY_ACCOUNT } from "@/lib/dummy-users";
import type { User } from "@/types/auth";

const STORAGE_KEY = "deck-forge:user";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: (email: string) => void;
  register: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const authListeners = new Set<() => void>();

function subscribeAuth(listener: () => void) {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

function notifyAuth() {
  authListeners.forEach((listener) => listener());
}

let cachedUserRaw: string | null | undefined;
let cachedUserSnapshot: User | null = null;

function readStoredUserRaw(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

function parseUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function getUserSnapshot(): User | null {
  const raw = readStoredUserRaw();
  if (raw === cachedUserRaw) return cachedUserSnapshot;
  cachedUserRaw = raw;
  cachedUserSnapshot = parseUser(raw);
  return cachedUserSnapshot;
}

function getServerUserSnapshot(): User | null {
  return null;
}

function getReadySnapshot(): boolean {
  return typeof window !== "undefined";
}

function getServerReadySnapshot(): boolean {
  return false;
}

function saveUser(user: User | null) {
  if (user) {
    const raw = JSON.stringify(user);
    localStorage.setItem(STORAGE_KEY, raw);
    cachedUserRaw = raw;
    cachedUserSnapshot = user;
  } else {
    localStorage.removeItem(STORAGE_KEY);
    cachedUserRaw = null;
    cachedUserSnapshot = null;
  }
}

function toUser(email: string, name: string, id?: string): User {
  return {
    id: id ?? `user-${email}`,
    email,
    name,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(
    subscribeAuth,
    getUserSnapshot,
    getServerUserSnapshot
  );
  const ready = useSyncExternalStore(
    () => () => {},
    getReadySnapshot,
    getServerReadySnapshot
  );

  const login = useCallback((email: string) => {
    const account = findDummyAccount(email) ?? DEFAULT_DUMMY_ACCOUNT;
    const nextUser = toUser(account.email, account.name, account.id);
    saveUser(nextUser);
    notifyAuth();
  }, []);

  const register = useCallback((email: string, name?: string) => {
    const trimmed = email.trim() || DEFAULT_DUMMY_ACCOUNT.email;
    const displayName = name?.trim() || trimmed.split("@")[0] || "Duelist";
    const nextUser = toUser(trimmed, displayName);
    saveUser(nextUser);
    notifyAuth();
  }, []);

  const logout = useCallback(() => {
    saveUser(null);
    notifyAuth();
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
