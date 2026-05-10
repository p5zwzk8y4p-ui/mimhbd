import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, BUCKET, publicUrlFor } from "@/lib/supabase";
import { NOTE_COLORS, type NoteColor } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getToken(req: NextRequest): string | null {
  const t = req.headers.get("x-edit-token");
  return t && t.length > 0 ? t : null;
}

async function verifyOwnership(id: string, token: string) {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("notes")
    .select("id,edit_token,image_path")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  if ((data as any).edit_token !== token) return null;
  return data as { id: string; edit_token: string; image_path: string | null };
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ error: "missing token" }, { status: 401 });

    const owned = await verifyOwnership(params.id, token);
    if (!owned) return NextResponse.json({ error: "not allowed" }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const patch: Record<string, any> = {};

    if (typeof body.message === "string") {
      patch.message = body.message.trim().slice(0, 2500) || null;
    }
    if (typeof body.author === "string") {
      patch.author = body.author.trim().slice(0, 40) || null;
    }
    if (typeof body.is_anon === "boolean") {
      patch.is_anon = body.is_anon;
      if (body.is_anon) patch.author = null;
    }
    if (typeof body.color === "string" && (NOTE_COLORS as readonly string[]).includes(body.color)) {
      patch.color = body.color as NoteColor;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "nothing to update" }, { status: 400 });
    }

    if (patch.is_anon === false && (!patch.author || patch.author.length === 0)) {
      return NextResponse.json({ error: "name required unless anonymous" }, { status: 400 });
    }

    patch.updated_at = new Date().toISOString();

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("notes")
      .update(patch)
      .eq("id", params.id)
      .select("id,kind,message,image_path,author,is_anon,color,created_at")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      note: { ...data, image_url: data.image_path ? publicUrlFor(data.image_path) : null }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "unknown error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ error: "missing token" }, { status: 401 });

    const owned = await verifyOwnership(params.id, token);
    if (!owned) return NextResponse.json({ error: "not allowed" }, { status: 403 });

    const sb = supabaseAdmin();
    const { error } = await sb.from("notes").delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (owned.image_path) {
      await sb.storage.from(BUCKET).remove([owned.image_path]).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "unknown error" }, { status: 500 });
  }
}
