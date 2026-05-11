"use client";

import { motion } from "framer-motion";
import type { Note } from "@/lib/types";

function Stat({
  label,
  value,
  glyph,
  tone,
  delay = 0
}: {
  label: string;
  value: number | string;
  glyph: string;
  tone: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.6, delay }}
      className="paper relative rounded-3xl p-5 md:p-6 shadow-card"
      style={{ background: tone, border: "1.5px solid rgba(255,255,255,0.6)" }}
    >
      <span className="tape" />
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="pixel-label">{label}</div>
          <div className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-none mt-2 text-ink">
            {value}
          </div>
        </div>
        <div className="text-3xl md:text-4xl drift" aria-hidden>{glyph}</div>
      </div>
    </motion.div>
  );
}

export function Highlights({ notes }: { notes: Note[] }) {
  const total = notes.length;
  const handwritten = notes.filter((n) => n.kind === "image").length;
  const digital = notes.filter((n) => n.kind === "digital").length;
  const anon = notes.filter((n) => n.is_anon).length;

  const latest = notes[notes.length - 1];
  const latestName = latest
    ? latest.is_anon
      ? "a secret friend"
      : (latest.author?.trim() || "a friend")
    : "—";

  return (
    <section className="px-6 pt-6 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <span className="chip">✦ highlights</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3">
              the spell is{" "}
              <span className="scribble-underline">working</span>
            </h2>
          </div>
          <p className="font-hand text-2xl text-plum">
            {total === 0
              ? "be the first to cast a wish ✦"
              : `${total} ${total === 1 ? "wish" : "wishes"} and counting…`}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Stat
            label="total wishes"
            value={total}
            glyph="✦"
            tone="linear-gradient(135deg, #FFD8EC, #FFB3D9)"
            delay={0}
          />
          <Stat
            label="digital notes"
            value={digital}
            glyph="✿"
            tone="linear-gradient(135deg, #E4D6FF, #C8B0FF)"
            delay={0.1}
          />
          <Stat
            label="hand-made"
            value={handwritten}
            glyph="✎"
            tone="linear-gradient(135deg, #D6ECFF, #A8B5FF)"
            delay={0.2}
          />
          <Stat
            label="from anon"
            value={anon}
            glyph="◍"
            tone="linear-gradient(135deg, #CFF3E2, #B5F0DA)"
            delay={0.3}
          />
        </div>

        {total > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 font-hand text-xl md:text-2xl text-ink/80"
          >
            ✿ latest enchantment cast by <span className="text-magenta font-semibold">{latestName}</span>
          </motion.p>
        )}
      </div>
    </section>
  );
}
