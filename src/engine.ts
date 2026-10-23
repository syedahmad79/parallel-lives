import { attributes, chapters, scenarioIds, tones, values } from "./model";
import type { Condition, Setup, State, Story } from "./model";
import { getScenario } from "./stories";
export const defaultSetup: Setup = {
  name: "",
  chapter: "Exploring",
  scenario: "abroad",
  custom: "",
  value: "Freedom",
  tone: "Bittersweet",
};
export function variation(seed: number, salt: number, count: number) {
  let n = (seed ^ Math.imul(salt + 1, 2654435761)) >>> 0;
  n = Math.imul(n ^ (n >>> 16), 2246822507);
  n = Math.imul(n ^ (n >>> 13), 3266489909);
  return ((n ^ (n >>> 16)) >>> 0) % count;
}
export function eligible(
  condition: Condition | undefined,
  state: State,
): boolean {
  return (
    !condition ||
    ((!condition.flag || state.flags.includes(condition.flag)) &&
      (!condition.attribute ||
        state.stats[condition.attribute] >= (condition.min ?? 0)))
  );
}
export function initialState(): State {
  return {
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
  };
}
export function derive(story: Story): State {
  const scenario = getScenario(story.setup.scenario);
  const state = initialState();
  if (story.history.length > scenario.scenes.length)
    throw new Error("This timeline has too many decisions.");
  for (const id of story.history) {
    const scene = scenario.scenes[state.step];
    const choice = scene.choices.find((c) => c.id === id);
    if (!choice || !eligible(choice.requires, state))
      throw new Error("This timeline contains an unavailable decision.");
    for (const key of attributes)
      state.stats[key] = Math.max(
        0,
        Math.min(20, state.stats[key] + (choice.effects[key] ?? 0)),
      );
    state.flags.push(choice.flag);
    state.step++;
  }
  state.complete = state.step === scenario.scenes.length;
  return state;
}
export function createStory(
  setup: Setup,
  seed = crypto.getRandomValues(new Uint32Array(1))[0],
): Story {
  return {
    version: 1,
    id: crypto.randomUUID(),
    seed,
    setup: { ...setup, name: setup.name.trim(), custom: setup.custom.trim() },
    history: [],
    createdAt: new Date().toISOString(),
  };
}
export function choose(story: Story, choiceId: string): Story {
  if (derive(story).complete)
    throw new Error("This life has already reached its ending.");
  const next = { ...story, history: [...story.history, choiceId] };
  derive(next);
  return next;
}
export function rewind(story: Story, index: number): Story {
  if (!Number.isInteger(index) || index < 0 || index > story.history.length)
    throw new Error("That moment has not been reached.");
  return {
    ...story,
    id: crypto.randomUUID(),
    history: story.history.slice(0, index),
  };
}
export function endingFor(story: Story) {
  const state = derive(story);
  if (!state.complete) return undefined;
  return getScenario(story.setup.scenario).endings.find((e) =>
    state.flags.includes(e.id),
  );
}
const chapterText: Record<Setup["chapter"], string> = {
  Student:
    "You are used to being asked what comes next. Here, you get to try an answer.",
  "Early career":
    "You have begun building a life. This is a chance to imagine its foundations differently.",
  Exploring: "You do not need a settled direction to step into a possible one.",
  Established: "Even a life with deep roots can hold an unopened door.",
  Other: "No neat label has to contain the life you bring to this crossroads.",
};
const toneText: Record<Setup["tone"], string[]> = {
  Hopeful: [
    "Something small is beginning to feel possible.",
    "There is room for a little more light.",
    "You notice what is still here to build on.",
  ],
  Bittersweet: [
    "Even a beginning leaves something behind.",
    "You miss something you cannot quite name.",
    "The good part and the difficult part are often the same thing.",
  ],
  Mysterious: [
    "For a moment, the room feels like a place you have visited in a dream.",
    "You wonder which details another version of you would remember.",
    "An unfamiliar future waits inside an ordinary afternoon.",
  ],
  Realistic: [
    "The practical details are still there. So are you.",
    "There are bills to pay and people to call.",
    "A choice can change the calendar before it changes the heart.",
  ],
};
export function framing(story: Story) {
  const state = derive(story);
  const scenario = getScenario(story.setup.scenario);
  return {
    chapter: chapterText[story.setup.chapter],
    tone: toneText[story.setup.tone][variation(story.seed, state.step, 3)],
    motif:
      scenario.motif[
        variation(story.seed, state.step + 20, scenario.motif.length)
      ],
  };
}
export function validateStory(value: unknown): Story {
  if (!value || typeof value !== "object")
    throw new Error("A life must be an object.");
  const s = value as Record<string, unknown>;
  const p = s.setup as Record<string, unknown> | undefined;
  if (s.version !== 1)
    throw new Error("This file uses an unsupported story version.");
  if (
    typeof s.id !== "string" ||
    !/^[a-zA-Z0-9-]{1,80}$/.test(s.id) ||
    !Number.isInteger(s.seed) ||
    (s.seed as number) < 0 ||
    (s.seed as number) > 4294967295 ||
    typeof s.createdAt !== "string" ||
    s.createdAt.length > 40 ||
    !Number.isFinite(Date.parse(s.createdAt))
  )
    throw new Error("Invalid story identity or seed.");
  if (
    !p ||
    typeof p !== "object" ||
    typeof p.name !== "string" ||
    p.name.length > 40 ||
    typeof p.custom !== "string" ||
    p.custom.length > 240 ||
    !scenarioIds.includes(p.scenario as never) ||
    !chapters.includes(p.chapter as never) ||
    !values.includes(p.value as never) ||
    !tones.includes(p.tone as never)
  )
    throw new Error("Invalid story setup.");
  if (
    !Array.isArray(s.history) ||
    s.history.length > 5 ||
    !s.history.every((x) => typeof x === "string" && x.length < 40)
  )
    throw new Error("Invalid decision history.");
  const clean: Story = {
    version: 1,
    id: s.id,
    seed: s.seed as number,
    createdAt: s.createdAt,
    setup: {
      name: p.name,
      custom: p.custom,
      chapter: p.chapter as Setup["chapter"],
      scenario: p.scenario as Setup["scenario"],
      value: p.value as Setup["value"],
      tone: p.tone as Setup["tone"],
    },
    history: [...s.history],
  };
  derive(clean);
  return clean;
}
export function parseArchive(raw: string): Story[] {
  if (raw.length > 1_000_000)
    throw new Error(
      "The file is too large. Choose a PARALLEL export under 1 MB.",
    );
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("This file is not valid JSON.");
  }
  if (
    !data ||
    typeof data !== "object" ||
    (data as { format?: string }).format !== "parallel-lives" ||
    (data as { version?: number }).version !== 1 ||
    !Array.isArray((data as { stories?: unknown }).stories)
  )
    throw new Error("Choose a PARALLEL version 1 export.");
  const stories = (data as { stories: unknown[] }).stories;
  if (stories.length > 100)
    throw new Error("An archive can contain at most 100 lives.");
  const parsed = stories.map(validateStory);
  if (parsed.some((s) => !derive(s).complete))
    throw new Error("Gallery imports must contain completed lives.");
  if (new Set(parsed.map((s) => s.id)).size !== parsed.length)
    throw new Error("This archive contains duplicate story IDs.");
  return parsed;
}
