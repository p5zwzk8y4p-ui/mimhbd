"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COLOR_TOKENS, NOTE_COLORS, type Note, type NoteColor } from "@/lib/types";
import { Sparkle, MagicWand, HeartDoodle } from "./Decorations";
import { remember, getToken } from "@/lib/ownership";

const EMOJI_QUICK = ["✿", "✦", "♡", "★", "✧", "♪", "☁", "✎", "♥", "✩", "🌸", "🦋", "💗", "🪄", "🐠"];

export function AddNoteDialog({
  open,
  onClose,
  onSubmitted,
  editing
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  editing?: Note | null;
}) {
  const isEdit = !!editing;
  const lockedKind: "digital" | "image" | null = editing ? editing.kind : null;

  const [tab, setTab] = useState<"digital" | "image">(editing?.kind ?? "digital");
  const [message, setMessage] = useState(editing?.message ?? "");
  const [author, setAuthor] = useState(editing?.author ?? "");
  const [isAnon, setIsAnon] = useState(editing?.is_anon ?? false);
  const [color, setColor] = useState<NoteColor>(editing?.color ?? "bubble");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-sync form when editing changes (i.e. dialog reopens for a different note)
  useEffect(() => {
    if (!open) return;
    if (editing) {
      setTab(editing.kind);
      setMessage(editing.message ?? "");
      setAuthor(editing.author ?? "");
      setIsAnon(editing.is_anon);
      setColor(editing.color);
      setFile(null);
      setPreview(null);
      setError(null);
      setSuccess(false);
    } else {
      setTab("digital");
      setMessage("");
      setAuthor("");
      setIsAnon(false);
      setColor("bubble");
      setFile(null);
      setPreview(null);
      setError(null);
      setSuccess(false);
    }
  }, [open, editing]);

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

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  function insertEmoji(e: string) {
    const el = textareaRef.current;
    if (!el) { setMessage((m) => m + e); return; }
    const start = el.selectionStart ?? message.length;
    const end = el.selectionEnd ?? message.length;
    const next = message.slice(0, start) + e + message.slice(end);
    setMessage(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + e.length;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const effectiveKind = isEdit ? lockedKind! : tab;

    if (effectiveKind === "digital" && !message.trim()) {
      setError("a wish needs at least a few words ✿");
      return;
    }
    if (!isEdit && effectiveKind === "image" && !file) {
      setError("please pick a doodle/photo to upload ✎");
      return;
    }
    if (!isAnon && !author.trim()) {
      setError("either sign your name or check 'send anonymously' ★");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && editing) {
        const token = getToken(editing.id);
        if (!token) throw new Error("you can't edit this note from this device.");
        const res = await fetch(`/api/notes/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-edit-token": token },
          body: JSON.stringify({
            message,
            author: isAnon ? "" : author.trim(),
            is_anon: isAnon,
            color
          })
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || "couldn't save the change ✦");
        }
      } else {
        const form = new FormData();
        form.set("kind", effectiveKind);
        form.set("message", message);
        form.set("author", isAnon ? "" : author.trim());
        form.set("is_anon", String(isAnon));
        form.set("color", color);
        if (effectiveKind === "image" && file) form.set("file", file);

        const res = await fetch("/api/notes", { method: "POST", body: form });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || "something fizzled. please try again ✦");
        }
        const j = await res.json();
        if (j?.note?.id && j?.edit_token) remember(j.note.id, j.edit_token);
      }

      setSuccess(true);
      onSubmitted();
      onClose();
    } catch (err: any) {
      setError(err.message || "something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-md"
            style={{ background: "linear-gradient(180deg, rgba(58,31,77,0.35), rgba(58,31,77,0.55))" }}
            onClick={onClose}
          />
          <motion.div
            role="dialog" aria-modal="true"
            initial={{ y: 30, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className="paper relative w-full max-w-2xl rounded-[28px] shadow-pop"
            style={{
              background: "linear-gradient(160deg, #FFF6FA 0%, #FFE4F0 50%, #E8DCFF 100%)",
              border: "1.5px solid rgba(255,255,255,0.7)"
            }}
          >
            <Sparkle size={16} className="!absolute -top-3 left-10" delay={0} />
            <Sparkle size={12} className="!absolute -top-2 right-16" delay={0.4} />
            <span className="tape" style={{ background: "rgba(255,143,191,0.4)", width: 110, height: 24 }} />

            <button
              onClick={onClose}
              aria-label="close"
              className="absolute top-3 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-ink/70 hover:text-ink transition shadow-sm border border-white"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8 max-h-[88vh] overflow-y-auto">
              <div className="text-center">
                <span className="chip">
                  {isEdit ? "✦ edit your wish" : "✦ a wish for mimiru"}
                </span>
                <h3 className="font-display text-3xl sm:text-4xl mt-2 leading-tight">
                  {isEdit ? <>tweak the <span className="scribble-underline">spell</span></> : <>cast your <span className="scribble-underline">spell</span></>}
                </h3>
                <p className="font-hand text-xl text-plum mt-1">
                  {isEdit ? "fix a typo, change the colour, swap your name ♡" : "every wish makes the magic stronger ♡"}
                </p>
              </div>

              {/* Tabs (hidden in edit mode — kind is locked) */}
              {!isEdit && (
                <div className="mt-6 grid grid-cols-2 gap-2 p-1 rounded-full bg-white/60 border border-white/70 max-w-sm mx-auto">
                  {(["digital", "image"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`relative py-2.5 rounded-full text-sm font-semibold transition ${tab === t ? "text-white" : "text-plum hover:text-ink"}`}
                    >
                      {tab === t && (
                        <motion.span
                          layoutId="tab-pill"
                          className="absolute inset-0 rounded-full"
                          style={{ background: "linear-gradient(135deg, #FF8FBF, #C8B0FF)" }}
                          transition={{ type: "spring", damping: 22, stiffness: 260 }}
                        />
                      )}
                      <span className="relative inline-flex items-center gap-1.5">
                        {t === "digital" ? <>✿ digital note</> : <>✎ doodle / photo</>}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={submit} className="mt-6 space-y-5">
                {(isEdit ? lockedKind === "digital" : tab === "digital") ? (
                  <div>
                    <label className="pixel-label">your wish</label>
                    <textarea
                      ref={textareaRef}
                      className="field mt-2 font-body text-lg leading-relaxed"
                      placeholder="dear mimiru, may your stream stay enchanted forever..."
                      maxLength={2500}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{
                        background: COLOR_TOKENS[color].bg + "cc",
                        color: COLOR_TOKENS[color].ink
                      }}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {EMOJI_QUICK.map((e) => (
                          <button
                            key={e} type="button" onClick={() => insertEmoji(e)}
                            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-white/80 transition text-base"
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                      <span className="pixel-label opacity-70">{message.length}/2500</span>
                    </div>

                    <div className="mt-4">
                      <div className="pixel-label mb-2">card color</div>
                      <div className="flex flex-wrap gap-2.5">
                        {NOTE_COLORS.map((nc) => (
                          <button
                            key={nc} type="button" onClick={() => setColor(nc)}
                            aria-label={nc}
                            className="w-9 h-9 rounded-full transition border-2"
                            style={{
                              background: COLOR_TOKENS[nc].bg,
                              borderColor: color === nc ? COLOR_TOKENS[nc].tape : "rgba(255,255,255,0.7)",
                              boxShadow: color === nc ? `0 0 0 3px ${COLOR_TOKENS[nc].tape}55, 0 6px 14px -8px ${COLOR_TOKENS[nc].tape}` : "0 4px 10px -6px rgba(58,31,77,0.3)",
                              transform: color === nc ? "scale(1.08)" : "scale(1)"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {isEdit ? (
                      editing?.image_url ? (
                        <div>
                          <label className="pixel-label">attached doodle (cannot be changed)</label>
                          <div className="mt-2 rounded-2xl border border-white/70 bg-white/70 p-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={editing.image_url} alt="current attachment" className="rounded-xl max-h-72 mx-auto" />
                          </div>
                          <p className="pixel-label opacity-70 mt-2">
                            to swap the image, delete this note and create a new one ✦
                          </p>
                        </div>
                      ) : null
                    ) : (
                      <>
                        <span className="pixel-label">attach a doodle or photo</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 w-full rounded-2xl border-2 border-dashed cursor-pointer transition hover:bg-white/70 text-left"
                          style={{ borderColor: "rgba(255,143,191,0.5)", background: "rgba(255,255,255,0.55)" }}
                        >
                          {preview ? (
                            <div className="p-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={preview} alt="preview" className="rounded-xl max-h-72 mx-auto" />
                              <p className="text-center pixel-label mt-3 opacity-70">click to change</p>
                            </div>
                          ) : (
                            <div className="py-10 px-6 text-center">
                              <div className="text-4xl mb-2">✎</div>
                              <p className="font-body text-lg text-plum">drop a hand-drawn note or photo</p>
                              <p className="pixel-label mt-2 opacity-70">png, jpg, gif · up to 10 mb</p>
                            </div>
                          )}
                        </button>
                      </>
                    )}

                    <label className="pixel-label mt-5 block">caption (optional)</label>
                    <input
                      type="text" maxLength={140}
                      placeholder="a tiny note to go with it ✦"
                      className="field mt-2 font-body text-base"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                )}

                {/* Author */}
                <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                  <div>
                    <label className="pixel-label">your name</label>
                    <input
                      type="text" maxLength={40}
                      disabled={isAnon}
                      placeholder={isAnon ? "✦ remaining anonymous ✦" : "e.g. yuki from the chat"}
                      className="field mt-2 disabled:opacity-50"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 select-none cursor-pointer h-[46px] px-4 rounded-2xl bg-white/70 border border-white">
                    <input
                      type="checkbox"
                      className="accent-magenta scale-125"
                      checked={isAnon}
                      onChange={(e) => setIsAnon(e.target.checked)}
                    />
                    <span className="text-sm font-semibold text-plum">send anonymously</span>
                  </label>
                </div>

                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm font-semibold"
                    style={{ background: "rgba(255,143,191,0.18)", color: "#9c1e5d", border: "1px solid rgba(255,111,168,0.4)" }}>
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button type="button" onClick={onClose} className="btn-ghost">cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting
                      ? <>{isEdit ? "saving…" : "casting…"}</>
                      : success
                        ? <>✓ {isEdit ? "saved" : "sent"} ♡</>
                        : <><MagicWand size={20}/> {isEdit ? "save changes" : "send the wish"}</>}
                  </button>
                </div>
              </form>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="text-5xl flex gap-3">
                      <span className="twinkle">✦</span>
                      <HeartDoodle size={48} />
                      <span className="twinkle" style={{ animationDelay: "0.3s" }}>✦</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
    </motion.div>
  );
}
