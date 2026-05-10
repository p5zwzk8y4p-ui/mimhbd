"use client";

const KEY = "mimiru:ownership:v1";

type OwnershipMap = Record<string, string>;

function read(): OwnershipMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function write(map: OwnershipMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("mimiru:ownership"));
  } catch {}
}

export function remember(noteId: string, token: string) {
  const m = read();
  m[noteId] = token;
  write(m);
}

export function forget(noteId: string) {
  const m = read();
  delete m[noteId];
  write(m);
}

export function getToken(noteId: string): string | null {
  return read()[noteId] ?? null;
}

export function ownedIds(): Set<string> {
  return new Set(Object.keys(read()));
}
