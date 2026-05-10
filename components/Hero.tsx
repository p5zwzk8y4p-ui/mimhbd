"use client";

import { motion } from "framer-motion";
import { Axolotl, Sparkle, Star4, MagicWand, HeartDoodle } from "./Decorations";

export function Hero({ onAddNote }: { onAddNote: () => void }) {
  return (
    <header className="relative px-6 pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-6xl mx-auto relative">
        {/* aura */}
        <div
          aria-hidden
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full glow-ring"
        />

        <div className="relative grid md:grid-cols-[1fr_auto_1fr] items-center gap-8">
          <div className="hidden md:flex justify-end">
            <motion.div
              initial={{ opacity: 0, x: -20, rotate: -10 }}
              animate={{ opacity: 1, x: 0, rotate: -8 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="float-slow" style={{ ['--r' as any]: "-8deg" }}>
                <Axolotl size={170} />
              </div>
            </motion.div>
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex items-center justify-center gap-2"
            >
              <Star4 size={14} fill="#C8B0FF" />
              <span className="pixel-label">★ a magical scrapbook ★</span>
              <Star4 size={14} fill="#FF8FBF" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(3rem,9vw,7rem)] leading-[0.95] mt-4 tracking-tight"
              style={{ color: "#3A1F4D", textShadow: "0 2px 0 rgba(255,255,255,0.4)" }}
            >
              <span className="block">happy</span>
              <span className="block">
                <span className="scribble-underline">birthday</span>
                <span className="inline-block ml-3 wiggle" style={{ ['--r' as any]: "-6deg" }}>,</span>
              </span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(90deg, #B7236B 0%, #6E3FB8 50%, #3F4FB8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 0 rgba(255,255,255,0.55)) drop-shadow(0 8px 18px rgba(110,63,184,0.25))"
                }}
              >
                mimiru ✿
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-hand text-2xl md:text-3xl mt-6 text-plum"
            >
              for our local{" "}
              <span className="relative inline-block">
                mahou shoujo
                <Sparkle size={14} className="!absolute" delay={0.5} />
              </span>
              <HeartDoodle size={22} className="inline-block ml-1 align-middle" />
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="max-w-xl mx-auto mt-5 text-ink/80 text-base md:text-lg"
            >
              the chat got together to make you a little corkboard of love.
              pin a note, paste a doodle, sign your name (or don't ✦) — every wish here is a tiny sparkle for your day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <button onClick={onAddNote} className="btn-primary">
                <MagicWand size={22} /> leave a note for mimiru
              </button>
              <a href="#board" className="btn-ghost">
                ✿ read what others wrote
              </a>
            </motion.div>
          </div>

          <div className="hidden md:flex justify-start">
            <motion.div
              initial={{ opacity: 0, x: 20, rotate: 10 }}
              animate={{ opacity: 1, x: 0, rotate: 8 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="float-slow" style={{ ['--r' as any]: "8deg", animationDelay: "1s" }}>
                <Axolotl size={150} style={{ transform: "scaleX(-1)" }} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
