import { describe, expect, it } from "vitest";
import {
  choose,
  createStory,
  defaultSetup,
  derive,
  eligible,
  endingFor,
  framing,
  parseArchive,
  rewind,
  validateStory,
  variation,
} from "../src/engine";
import { scenarios } from "../src/stories";
import type { Story } from "../src/model";
import { archive } from "../src/storage";
const start = () => createStory(defaultSetup, 42);
function completions(story: Story): Story[] {
  const state = derive(story);
  if (state.complete) return [story];
  const scenario = scenarios.find((s) => s.id === story.setup.scenario)!;
  return scenario.scenes[state.step].choices
    .filter((c) => eligible(c.requires, state))
    .flatMap((c) => completions(choose(story, c.id)));
}
export const finished = () => completions(start())[0];
describe("authored branching engine", () => {
  it("begins with balanced fictional resources and no history", () => {
    expect(derive(start())).toEqual({
      stats: {
        ambition: 5,
        connection: 5,
        stability: 5,
        freedom: 5,
        fulfillment: 5,
      },
      flags: [],
      step: 0,
      complete: false,
    });
  });
  it("applies choices immutably and exposes consequences", () => {
    const first = start();
    const next = choose(first, "work");
    expect(first.history).toEqual([]);
    expect(derive(next).stats.ambition).toBe(7);
    expect(derive(next).flags).toContain("work");
  });
  it("rejects nonexistent transitions", () =>
    expect(() => choose(start(), "not-a-choice")).toThrow());
  it("rejects a choice from the wrong node", () =>
    expect(() => choose(start(), "stay")).toThrow());
  it("gates conditional choices on actual history", () => {
    let s = start();
    for (const c of ["work", "visit", "promotion", "family"]) s = choose(s, c);
    expect(
      eligible(scenarios[0].scenes[4].choices[2].requires, derive(s)),
    ).toBe(false);
    expect(() => choose(s, "bridge")).toThrow();
  });
  it("opens the flexible ending when earlier choices support it", () => {
    let s = start();
    for (const c of ["wander", "lessons", "independent", "boundary", "bridge"])
      s = choose(s, c);
    expect(endingFor(s)?.id).toBe("end-bridge");
  });
  it("uses earlier decisions for conditional story callbacks", () => {
    const s = choose(start(), "work");
    expect(
      scenarios[0].scenes[1].echoes.filter((e) =>
        eligible(e.when, derive(s)),
      )[0].text,
    ).toContain("bonus");
  });
  it("rewinds by replaying only the retained prefix and assigns a separate identity", () => {
    const s = choose(choose(start(), "wander"), "lessons");
    const rewound = rewind(s, 1);
    expect(rewound.id).not.toBe(s.id);
    expect(derive(rewound)).toEqual(derive({ ...s, history: ["wander"] }));
    expect(derive(rewound).flags).not.toContain("language");
  });
  it("rejects invalid rewind positions", () => {
    expect(() => rewind(start(), -1)).toThrow();
    expect(() => rewind(start(), 1)).toThrow();
    expect(() => rewind(start(), 0.5)).toThrow();
  });
  it("is deterministic for the same seed and history", () => {
    const a = start();
    const b = { ...a };
    expect(framing(a)).toEqual(framing(b));
    expect(variation(42, 3, 3)).toBe(variation(42, 3, 3));
    expect(
      new Set(Array.from({ length: 50 }, (_, n) => variation(n, 3, 3))).size,
    ).toBe(3);
  });
  it("changes framing for chapter and tone without claiming to generate prose", () => {
    const s = start();
    expect(
      framing({
        ...s,
        setup: { ...s.setup, chapter: "Student", tone: "Hopeful" },
      }),
    ).not.toEqual(framing(s));
  });
  for (const scenario of scenarios)
    it(`${scenario.title}: every eligible path completes in five decisions and all three endings are reachable`, () => {
      const ends = completions(
        createStory({ ...defaultSetup, scenario: scenario.id }, 12),
      );
      expect(ends.length).toBeGreaterThan(100);
      for (const s of ends) {
        expect(s.history).toHaveLength(5);
        expect(derive(s).complete).toBe(true);
        expect(endingFor(s)).toBeDefined();
        expect(() => choose(s, "anything")).toThrow();
      }
      expect(new Set(ends.map((s) => endingFor(s)?.id))).toEqual(
        new Set(scenario.endings.map((e) => e.id)),
      );
    });
});
describe("strict import validation", () => {
  it("round trips an exported archive", () => {
    const s = finished();
    expect(parseArchive(JSON.stringify(archive([s])))).toEqual([s]);
  });
  it("rejects malformed JSON", () =>
    expect(() => parseArchive("{no")).toThrow("valid JSON"));
  it("rejects outdated data", () =>
    expect(() =>
      parseArchive(
        JSON.stringify({ format: "parallel-lives", version: 0, stories: [] }),
      ),
    ).toThrow());
  it("rejects an unknown template and long inputs", () => {
    const s = start();
    expect(() =>
      validateStory({ ...s, setup: { ...s.setup, scenario: "love" } }),
    ).toThrow();
    expect(() =>
      validateStory({ ...s, setup: { ...s.setup, name: "x".repeat(41) } }),
    ).toThrow();
  });
  it("recomputes state and rejects tampered branch histories", () => {
    const s = finished();
    expect(() =>
      validateStory({
        ...s,
        history: ["work", "visit", "promotion", "family", "bridge"],
      }),
    ).toThrow();
  });
  it("does not trust injected resources or extra fields", () => {
    const s = start();
    const clean = validateStory({
      ...s,
      stats: { freedom: 100 },
      token: "ignore me",
    });
    expect(clean).toEqual(s);
    expect(derive(clean).stats.freedom).toBe(5);
  });
  it("rejects incomplete lives in gallery archives", () =>
    expect(() => parseArchive(JSON.stringify(archive([start()])))).toThrow(
      "completed",
    ));
  it("rejects oversized archives and duplicate IDs", () => {
    const s = finished();
    expect(() => parseArchive(" ".repeat(1_000_001))).toThrow("large");
    expect(() => parseArchive(JSON.stringify(archive([s, s])))).toThrow(
      "duplicate",
    );
    expect(() =>
      parseArchive(JSON.stringify(archive(Array(101).fill(s)))),
    ).toThrow("100");
  });
  it("rejects invalid seeds and setup enums", () => {
    const s = start();
    for (const seed of [-1, 1.5, 4294967296, NaN])
      expect(() => validateStory({ ...s, seed })).toThrow();
    expect(() =>
      validateStory({ ...s, setup: { ...s.setup, tone: "invalid" } }),
    ).toThrow();
  });
});
