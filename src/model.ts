export const scenarioIds = ["abroad", "passion", "risk"] as const;
export type ScenarioId = (typeof scenarioIds)[number];
export const attributes = [
  "ambition",
  "connection",
  "stability",
  "freedom",
  "fulfillment",
] as const;
export type Attribute = (typeof attributes)[number];
export type Stats = Record<Attribute, number>;
export const chapters = [
  "Student",
  "Early career",
  "Exploring",
  "Established",
  "Other",
] as const;
export const values = [
  "Freedom",
  "Love",
  "Ambition",
  "Belonging",
  "Creativity",
  "Adventure",
  "Security",
] as const;
export const tones = [
  "Hopeful",
  "Bittersweet",
  "Mysterious",
  "Realistic",
] as const;
export interface Setup {
  name: string;
  chapter: (typeof chapters)[number];
  scenario: ScenarioId;
  custom: string;
  value: (typeof values)[number];
  tone: (typeof tones)[number];
}
export interface Condition {
  flag?: string;
  attribute?: Attribute;
  min?: number;
}
export interface Choice {
  id: string;
  label: string;
  detail: string;
  consequence: string;
  effects: Partial<Stats>;
  flag: string;
  requires?: Condition;
  unavailable?: string;
}
export interface Scene {
  id: string;
  time: string;
  title: string;
  body: string[];
  echoes: { when: Condition; text: string }[];
  choices: Choice[];
}
export interface Ending {
  id: string;
  title: string;
  quote: string;
  paragraphs: string[];
  reflection: string;
}
export interface Scenario {
  id: ScenarioId;
  title: string;
  subtitle: string;
  location: string;
  color: string;
  intro: string;
  motif: string[];
  scenes: Scene[];
  endings: Ending[];
}
export interface Story {
  version: 1;
  id: string;
  seed: number;
  setup: Setup;
  history: string[];
  createdAt: string;
}
export interface State {
  stats: Stats;
  flags: string[];
  step: number;
  complete: boolean;
}
