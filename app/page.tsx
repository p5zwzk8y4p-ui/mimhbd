"use client";

import { useCallback, useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { NoteBoard } from "@/components/NoteBoard";
import { AddNoteDialog } from "@/components/AddNoteDialog";
import { ViewNoteDialog } from "@/components/ViewNoteDialog";
import { FloatingDecor } from "@/components/Decorations";
import type { Note } from "@/lib/types";

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [viewing, setViewing] = useState<Note | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notes", { cache: "no-store" });
      if (!res.ok) throw new Error("load failed");
      const j = await res.json();
      setNotes(j.notes ?? []);
    } catch {
      // keep prior state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Safety net: never let body overflow stay locked between modal transitions.
  useEffect(() => {
    if (!composerOpen && !viewing) {
      document.body.style.overflow = "";
    }
  }, [composerOpen, viewing]);

  function openComposer() {
    setEditing(null);
    setComposerOpen(true);
  }

  function startEdit(n: Note) {
    setViewing(null);
    setEditing(n);
    setComposerOpen(true);
  }

  function closeComposer() {
    setComposerOpen(false);
    // small delay so the close animation can run before clearing
    setTimeout(() => setEditing(null), 250);
  }

  return (
    <main>
      <FloatingDecor />
      <Hero onAddNote={openComposer} />
      <NoteBoard
        notes={notes}
        onAddNote={openComposer}
        onOpenNote={(n) => setViewing(n)}
      />
      <Highlights notes={notes} />

      <footer className="px-6 pb-12 text-center">
        <p className="font-hand text-2xl text-plum">
          made with ♡ by the chat · for mimiru ✦
        </p>
        <p className="pixel-label mt-2 opacity-70">
          {loading ? "summoning wishes…" : `${notes.length} ${notes.length === 1 ? "wish" : "wishes"} cast`}
        </p>
      </footer>

      <AddNoteDialog
        open={composerOpen}
        onClose={closeComposer}
        onSubmitted={load}
        editing={editing}
      />
      <ViewNoteDialog
        note={viewing}
        onClose={() => setViewing(null)}
        onEdit={startEdit}
        onDeleted={load}
      />
    </main>
  );
}
