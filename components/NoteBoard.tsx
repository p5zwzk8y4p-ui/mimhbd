"use client";

import { motion } from "framer-motion";
import type { Note } from "@/lib/types";
import { NoteCard } from "./NoteCard";
import { Star4 } from "./Decorations";

export function NoteBoard({
  notes,
  onAddNote,
  onOpenNote
}: {
  notes: Note[];
  onAddNote: () => void;
  onOpenNote?: (n: Note) => void;
}) {
  return (
    <section id="board" className="px-6 pb-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div>
            <span className="chip">✦ the corkboard</span>
            <h2 className="font-display text-3xl md:text-5xl mt-3">
              wishes from the{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #FF6FA8, #C8B0FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                chat
              </span>
            </h2>
          </div>
          <button onClick={onAddNote} className="btn-primary">
            <Star4 size={16} fill="#fff" /> pin your note
          </button>
        </div>

        {notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="paper rounded-3xl py-16 px-8 text-center shadow-card border border-white/60"
            style={{ background: "linear-gradient(135deg, #FFE4F0, #E4D6FF)" }}
          >
            <div className="text-5xl mb-3 drift" aria-hidden>✦</div>
            <h3 className="font-display text-3xl">the board is empty for now</h3>
            <p className="font-hand text-2xl text-plum mt-2">
              be the very first wish to sparkle here
            </p>
            <div className="mt-6">
              <button onClick={onAddNote} className="btn-primary">
                ✿ leave the first note
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {notes.map((n, i) => (
              <NoteCard key={n.id} note={n} index={i} onOpen={onOpenNote} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
