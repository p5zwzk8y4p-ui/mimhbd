"use client";

import { motion } from "framer-motion";
import { COLOR_TOKENS, type Note } from "@/lib/types";
import { Sparkle, HeartDoodle } from "./Decorations";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function nameFor(n: Note) {
  if (n.is_anon) return "a secret friend";
  return (n.author?.trim() || "a friend");
}

export function NoteCard({
  note,
  index,
  onOpen
}: {
  note: Note;
  index: number;
  onOpen?: (note: Note) => void;
}) {
  const c = COLOR_TOKENS[note.color] ?? COLOR_TOKENS.bubble;
  const rotate = ((index * 53) % 7) - 3;
  const author = nameFor(note);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, rotate: rotate * 1.4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
      transition={{ duration: 0.55, delay: (index % 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, rotate: rotate * 0.4, scale: 1.02 }}
      onClick={() => onOpen?.(note)}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onOpen) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(note);
        }
      }}
      aria-label={onOpen ? `open wish from ${author}` : undefined}
      className={`paper relative rounded-2xl shadow-card overflow-hidden h-80 flex flex-col ${onOpen ? "cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-rose/40" : ""}`}
      style={{
        background: c.bg,
        color: c.ink,
        border: "1.5px solid rgba(255,255,255,0.55)"
      }}
    >
      <span className="tape tape--heart pointer-events-none" style={{ background: `${c.tape}66` }} />
      <span className="pin pointer-events-none" />

      {note.kind === "image" && note.image_url ? (
        <div className="flex-1 flex flex-col min-h-0 px-3 pt-7 pb-2">
          <div
            className="flex-1 rounded-xl overflow-hidden border-[1.5px] min-h-0"
            style={{ borderColor: `${c.tape}55`, background: "#fff" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={note.image_url}
              alt={`a doodle from ${author}`}
              loading="lazy"
              draggable={false}
              className="w-full h-full object-cover block pointer-events-none select-none"
            />
          </div>
          {note.message && (
            <p
              className="font-body text-sm mt-2 leading-snug line-clamp-2"
              style={{ color: c.ink }}
            >
              {note.message}
            </p>
          )}
        </div>
      ) : (
        <div className="relative flex-1 px-6 py-7 pt-9 min-h-0 overflow-hidden">
          <p
            className="font-body text-base leading-relaxed line-clamp-6 break-words"
            style={{ color: c.ink }}
          >
            {note.message}
          </p>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
            style={{ background: `linear-gradient(180deg, ${c.bg}00 0%, ${c.bg} 100%)` }}
          />
        </div>
      )}

      <div className="px-5 pb-4 pt-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 font-body text-sm font-semibold truncate" style={{ color: c.ink, opacity: 0.85 }}>
          <HeartDoodle size={14} color={c.tape} />
          <span className="truncate">— {author}</span>
        </div>
        <div className="pixel-label shrink-0" style={{ color: c.ink, opacity: 0.65 }}>
          {formatDate(note.created_at)}
        </div>
      </div>

      <Sparkle size={10} className="!absolute right-3 top-3 pointer-events-none" delay={index * 0.13} />
    </motion.article>
  );
}
