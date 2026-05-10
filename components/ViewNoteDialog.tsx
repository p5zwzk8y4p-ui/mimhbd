"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COLOR_TOKENS, type Note } from "@/lib/types";
import { HeartDoodle, Sparkle, Star4 } from "./Decorations";
import { forget, getToken } from "@/lib/ownership";

function nameFor(n: Note) {
  if (n.is_anon) return "a secret friend";
  return n.author?.trim() || "a friend";
}

function formatDateLong(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}

export function ViewNoteDialog({
  note,
  onClose,
  onEdit,
  onDeleted
}: {
  note: Note | null;
  onClose: () => void;
  onEdit?: (n: Note) => void;
  onDeleted?: () => void;
}) {
  const open = !!note;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && note && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
          style={{ pointerEvents: open ? "auto" : "none" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-md"
            style={{ background: "linear-gradient(180deg, rgba(58,31,77,0.45), rgba(58,31,77,0.7))" }}
            onClick={onClose}
          />

          <ViewCard note={note} onClose={onClose} onEdit={onEdit} onDeleted={onDeleted} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ViewCard({
  note,
  onClose,
  onEdit,
  onDeleted
}: {
  note: Note;
  onClose: () => void;
  onEdit?: (n: Note) => void;
  onDeleted?: () => void;
}) {
  const c = COLOR_TOKENS[note.color] ?? COLOR_TOKENS.bubble;
  const author = nameFor(note);

  const [owned, setOwned] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOwned(!!getToken(note.id));
  }, [note.id]);

  async function doDelete() {
    setError(null);
    setDeleting(true);
    try {
      const token = getToken(note.id);
      if (!token) throw new Error("you can't delete this note from this device.");
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
        headers: { "x-edit-token": token }
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "couldn't delete");
      }
      forget(note.id);
      onDeleted?.();
      onClose();
    } catch (e: any) {
      setError(e.message || "something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ y: 30, opacity: 0, scale: 0.94, rotate: -2 }}
      animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
      exit={{ y: 16, opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", damping: 24, stiffness: 220 }}
      className="paper relative w-full max-w-3xl rounded-[28px] shadow-pop overflow-hidden"
      style={{
        background: c.bg,
        color: c.ink,
        border: "1.5px solid rgba(255,255,255,0.65)"
      }}
    >
      <span className="tape tape--heart" style={{ background: `${c.tape}88`, width: 130, height: 26 }} />
      <span className="pin" style={{ width: 18, height: 18 }} />
      <Sparkle size={18} className="!absolute -top-3 right-12" delay={0} />
      <Sparkle size={12} className="!absolute -top-2 right-32" delay={0.3} />

      <button
        onClick={onClose}
        aria-label="close"
        className="absolute top-3 right-4 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-ink/70 hover:text-ink transition shadow-sm border border-white z-10"
      >
        ✕
      </button>

      {owned && (
        <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
          <span
            className="pixel-label rounded-full px-2.5 py-1 bg-white/85 border border-white"
            style={{ color: c.ink }}
          >
            ✦ your wish
          </span>
        </div>
      )}

      <div className="max-h-[88vh] overflow-y-auto p-6 sm:p-10 pt-14 sm:pt-16">
        {note.kind === "image" && note.image_url ? (
          <div>
            <div
              className="rounded-2xl overflow-hidden border-2 mx-auto"
              style={{ borderColor: `${c.tape}66`, background: "#fff", maxWidth: "100%" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={note.image_url}
                alt={`a doodle from ${author}`}
                className="w-full h-auto block max-h-[60vh] object-contain mx-auto"
              />
            </div>
            {note.message && (
              <p
                className="font-body text-lg sm:text-xl mt-6 leading-relaxed text-center whitespace-pre-wrap break-words"
                style={{ color: c.ink }}
              >
                {note.message}
              </p>
            )}
          </div>
        ) : (
          <p
            className="font-body text-[clamp(1.1rem,2.4vw,1.6rem)] leading-relaxed whitespace-pre-wrap break-words text-center"
            style={{ color: c.ink }}
          >
            {note.message}
          </p>
        )}

        <div className="mt-8 pt-6 border-t flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: `${c.tape}55` }}>
          <div className="flex items-center gap-2 font-body text-base font-semibold" style={{ color: c.ink }}>
            <HeartDoodle size={20} color={c.tape} />
            <span>— {author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star4 size={14} fill={c.tape} />
            <span className="pixel-label" style={{ color: c.ink, opacity: 0.7 }}>
              {formatDateLong(note.created_at)}
            </span>
          </div>
        </div>

        {owned && (
          <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
            {!confirmDelete ? (
              <>
                <button
                  type="button"
                  onClick={() => onEdit?.(note)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-white/85 hover:bg-white border border-white transition"
                  style={{ color: c.ink }}
                >
                  ✎ edit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border transition"
                  style={{
                    background: "rgba(255,143,191,0.18)",
                    color: "#9c1e5d",
                    borderColor: "rgba(255,111,168,0.4)"
                  }}
                >
                  🗑 delete
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="pixel-label" style={{ color: c.ink }}>delete this wish?</span>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-full text-sm bg-white/85 hover:bg-white border border-white"
                >
                  cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={doDelete}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold disabled:opacity-60"
                  style={{
                    background: "#E0468A",
                    color: "#fff",
                    boxShadow: "0 6px 14px -8px rgba(224,70,138,0.6)"
                  }}
                >
                  {deleting ? "deleting…" : "yes, delete"}
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{ background: "rgba(255,143,191,0.18)", color: "#9c1e5d", border: "1px solid rgba(255,111,168,0.4)" }}>
            {error}
          </div>
        )}
      </div>
    </motion.div>
  );
}
