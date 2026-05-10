import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, BUCKET, publicUrlFor } from "@/lib/supabase";
import { NOTE_COLORS, type NoteColor } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const PUBLIC_COLS =
  "id,kind,message,image_path,author,is_anon,color,created_at";

export async function GET() {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("notes")
    .select(PUBLIC_COLS)
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const notes = (data ?? []).map((n: any) => ({
    ...n,
    image_url: n.image_path ? publicUrlFor(n.image_path) : null
  }));
  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const kind = String(form.get("kind") || "");
    const message = String(form.get("message") || "").trim().slice(0, 600);
    const author = String(form.get("author") || "").trim().slice(0, 40);
    const isAnon = String(form.get("is_anon") || "false") === "true";
    const colorRaw = String(form.get("color") || "bubble");
    const color: NoteColor = (NOTE_COLORS as readonly string[]).includes(colorRaw)
      ? (colorRaw as NoteColor)
      : "bubble";

    if (!["digital", "image"].includes(kind)) {
      return NextResponse.json({ error: "invalid kind" }, { status: 400 });
    }

    if (!isAnon && !author) {
      return NextResponse.json({ error: "name required unless anonymous" }, { status: 400 });
    }

    const sb = supabaseAdmin();
    let imagePath: string | null = null;

    if (kind === "digital") {
      if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });
    } else {
      const file = form.get("file") as Blob | null;
      if (!file || typeof (file as Blob).arrayBuffer !== "function" || (file as Blob).size === 0) {
        return NextResponse.json({ error: "file required" }, { status: 400 });
      }
      if (!ALLOWED.includes(file.type)) {
        return NextResponse.json({ error: "unsupported file type" }, { status: 400 });
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: "file too large (max 10 mb)" }, { status: 400 });
      }
      const ext = file.type === "image/png" ? "png"
        : file.type === "image/webp" ? "webp"
          : file.type === "image/gif" ? "gif" : "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());
      const { error: upErr } = await sb.storage
        .from(BUCKET)
        .upload(path, buf, { contentType: file.type, upsert: false });
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });
      imagePath = path;
    }

    const { data, error } = await sb
      .from("notes")
      .insert({
        kind,
        message: message || null,
        image_path: imagePath,
        author: isAnon ? null : author,
        is_anon: isAnon,
        color
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { edit_token, ...publicNote } = data as any;
    return NextResponse.json({
      note: { ...publicNote, image_url: data.image_path ? publicUrlFor(data.image_path) : null },
      edit_token
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "unknown error" }, { status: 500 });
  }
}
