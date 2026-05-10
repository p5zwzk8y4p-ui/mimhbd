export type NoteColor =
  | "bubble"
  | "lavender"
  | "peri"
  | "mint"
  | "butter"
  | "sky"
  | "rose";

export const NOTE_COLORS: NoteColor[] = [
  "bubble",
  "lavender",
  "peri",
  "mint",
  "butter",
  "sky",
  "rose"
];

export const COLOR_TOKENS: Record<NoteColor, { bg: string; ink: string; tape: string }> = {
  bubble:   { bg: "#FFD8EC", ink: "#5B1B47", tape: "#FF8FBF" },
  lavender: { bg: "#E4D6FF", ink: "#3A1F66", tape: "#C8B0FF" },
  peri:     { bg: "#D6DEFF", ink: "#1F2D66", tape: "#A8B5FF" },
  mint:     { bg: "#CFF3E2", ink: "#16513A", tape: "#7ED6B0" },
  butter:   { bg: "#FFF1B8", ink: "#5A4400", tape: "#F2CC8F" },
  sky:      { bg: "#D6ECFF", ink: "#173A66", tape: "#8AB6D6" },
  rose:     { bg: "#FFC3D9", ink: "#5B1F47", tape: "#FF6FA8" }
};

export interface Note {
  id: string;
  kind: "digital" | "image";
  message: string | null;
  image_path: string | null;
  image_url?: string | null;
  author: string | null;
  is_anon: boolean;
  color: NoteColor;
  created_at: string;
}
