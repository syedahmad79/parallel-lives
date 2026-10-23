import { describe, expect, it, vi } from "vitest";
import {
  ACTIVE_KEY,
  GALLERY_KEY,
  archive,
  mergeLives,
  readData,
  saveLife,
  writeData,
} from "../src/storage";
import { choose, createStory, defaultSetup } from "../src/engine";
function finished() {
  let s = createStory(defaultSetup, 1);
  for (const id of ["work", "visit", "promotion", "family", "stay"])
    s = choose(s, id);
  return s;
}
describe("device persistence", () => {
  it("restores active and completed stories", () => {
    const s = finished();
    expect(writeData(ACTIVE_KEY, s)).toBe("");
    expect(writeData(GALLERY_KEY, archive([s]))).toBe("");
    expect(readData()).toEqual({ active: s, gallery: [s], warning: "" });
  });
  it("does not destroy corrupted data", () => {
    localStorage.setItem(GALLERY_KEY, "broken");
    expect(readData().warning).toContain("left untouched");
    expect(localStorage.getItem(GALLERY_KEY)).toBe("broken");
  });
  it("handles a corrupted active session separately", () => {
    const s = finished();
    localStorage.setItem(ACTIVE_KEY, "null");
    writeData(GALLERY_KEY, archive([s]));
    expect(readData().gallery).toEqual([s]);
    expect(readData().active).toBeNull();
  });
  it("reports storage failures without crashing", () => {
    const mock = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("Quota exceeded");
      });
    expect(writeData(ACTIVE_KEY, finished())).toContain("unavailable or full");
    mock.mockRestore();
  });
  it("saves idempotently", () => {
    const s = finished();
    expect(saveLife([s], s)).toHaveLength(1);
  });
  it("rejects saving unfinished lives", () =>
    expect(() => saveLife([], createStory(defaultSetup, 1))).toThrow());
  it("merges without replacing an existing ID", () => {
    const s = finished();
    expect(
      mergeLives([s], [{ ...s, setup: { ...s.setup, name: "different" } }]),
    ).toEqual([s]);
  });
  it("enforces gallery capacity", () => {
    const s = finished();
    const many = Array.from({ length: 100 }, (_, i) => ({
      ...s,
      id: `story-${i}`,
    }));
    expect(() => saveLife(many, s)).toThrow("100");
    expect(() => mergeLives(many, [s])).toThrow("100");
  });
});
