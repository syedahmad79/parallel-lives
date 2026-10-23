import type { Story } from "./model";
import { derive, parseArchive, validateStory } from "./engine";
export const ACTIVE_KEY = "parallel.active.v1",
  GALLERY_KEY = "parallel.gallery.v1",
  MOTION_KEY = "parallel.motion.v1";
export function readData(): {
  active: Story | null;
  gallery: Story[];
  warning: string;
} {
  let active: Story | null = null;
  let gallery: Story[] = [];
  const warnings: string[] = [];
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (raw) active = validateStory(JSON.parse(raw));
  } catch {
    warnings.push(
      "Your previous session could not be restored. You can start a new life.",
    );
  }
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    if (raw) gallery = parseArchive(raw);
  } catch {
    warnings.push(
      "Saved lives could not be read. Your stored data has been left untouched; import a backup to recover it.",
    );
  }
  return { active, gallery, warning: warnings.join(" ") };
}
export function writeData(key: string, data: unknown): string {
  try {
    if (data === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(data));
    return "";
  } catch {
    return "Browser storage is unavailable or full. This session still works; export your lives before leaving.";
  }
}
export const archive = (stories: Story[]) => ({
  format: "parallel-lives",
  version: 1,
  stories,
});
export function saveLife(gallery: Story[], story: Story): Story[] {
  if (!derive(story).complete)
    throw new Error("Finish this life before saving it.");
  const next = [story, ...gallery.filter((s) => s.id !== story.id)];
  if (next.length > 100)
    throw new Error(
      "Your gallery holds 100 lives. Export a backup and delete one before saving.",
    );
  return next;
}
export function mergeLives(gallery: Story[], incoming: Story[]) {
  const map = new Map(gallery.map((s) => [s.id, s]));
  incoming.forEach((s) => {
    if (!map.has(s.id)) map.set(s.id, s);
  });
  if (map.size > 100)
    throw new Error("Import would exceed the 100-life gallery limit.");
  return [...map.values()];
}
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
