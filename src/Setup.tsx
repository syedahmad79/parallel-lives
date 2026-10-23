import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Globe2,
  Feather,
  Compass,
  PenLine,
} from "lucide-react";
import { chapters, tones, values } from "./model";
import type { Setup as SetupData, ScenarioId } from "./model";
import { defaultSetup } from "./engine";
import { scenarios } from "./stories";
const icons = [Globe2, Feather, Compass];
export default function Setup({
  onStart,
  onBack,
  initialScenario = "abroad",
}: {
  initialScenario?: ScenarioId;
  onStart: (setup: SetupData) => void;
  onBack: () => void;
}) {
  const section = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    section.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);
  const [data, setData] = useState<SetupData>({
    ...defaultSetup,
    scenario: initialScenario,
  });
  const [custom, setCustom] = useState(false);
  const field = <K extends keyof SetupData>(key: K, value: SetupData[K]) =>
    setData((d) => ({ ...d, [key]: value }));
  return (
    <section ref={section} tabIndex={-1} className="setup screen narrow">
      <div className="setup-top">
        <button
          className="text-button"
          onClick={() => (step ? setStep(step - 1) : onBack())}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <span className="eyebrow">THE THRESHOLD · 0{step + 1} / 03</span>
      </div>
      <div className="step-track">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i <= step ? "filled" : ""} />
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 2) setStep(step + 1);
          else onStart({ ...data, custom: custom ? data.custom : "" });
        }}
      >
        {step === 0 && (
          <>
            <span className="eyebrow gold">BEFORE THE WORLD CHANGES</span>
            <h1>
              Every life begins
              <br />
              with <em>someone.</em>
            </h1>
            <p className="lede">
              Bring as much of yourself as you like. Leave the rest to
              possibility.
            </p>
            <label className="field-label" htmlFor="nickname">
              What should we call you? <span>Optional</span>
            </label>
            <input
              id="nickname"
              placeholder="A name, a nickname, or a blank page"
              value={data.name}
              maxLength={40}
              autoComplete="off"
              onChange={(e) => field("name", e.target.value)}
            />
            <fieldset>
              <legend>Your current chapter</legend>
              <div className="pills">
                {chapters.map((ch) => (
                  <button
                    type="button"
                    className={data.chapter === ch ? "selected" : ""}
                    aria-pressed={data.chapter === ch}
                    onClick={() => field("chapter", ch)}
                    key={ch}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </fieldset>
            <p className="fineprint">
              All answers stay in this browser. Your chapter and tone shape the
              framing; your decisions shape the life.
            </p>
          </>
        )}
        {step === 1 && (
          <>
            <span className="eyebrow gold">ONE DIFFERENT DECISION</span>
            <h1>
              Where does your
              <br />
              life <em>divide?</em>
            </h1>
            <p className="lede">Choose a door you’ve wondered about.</p>
            <div className="scenario-select">
              {scenarios.map((s, i) => {
                const Icon = icons[i];
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={data.scenario === s.id}
                    className={`scenario-option ${data.scenario === s.id ? "selected" : ""}`}
                    onClick={() => field("scenario", s.id)}
                  >
                    <Icon size={24} />
                    <span>
                      <strong>{s.title}</strong>
                      <small>{s.subtitle}</small>
                    </span>
                    {data.scenario === s.id ? (
                      <Check size={18} />
                    ) : (
                      <ArrowRight size={18} />
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="text-button custom-toggle"
              aria-expanded={custom}
              onClick={() => setCustom(!custom)}
            >
              <PenLine size={16} />
              {custom
                ? "Use only the selected story"
                : "Create your own crossroads"}
            </button>
            {custom && (
              <div className="custom-field">
                <label htmlFor="crossroads">
                  What decision is on your mind?
                </label>
                <textarea
                  id="crossroads"
                  maxLength={240}
                  value={data.custom}
                  onChange={(e) => field("custom", e.target.value)}
                  placeholder="What if I finally made that move?"
                />
                <p className="fineprint">
                  Select the closest template above. Your words appear in the
                  introduction; this authored engine does not interpret free
                  text or generate a new story.
                </p>
              </div>
            )}
          </>
        )}
        {step === 2 && (
          <>
            <span className="eyebrow gold">A LITTLE OF YOUR INNER WORLD</span>
            <h1>
              What will you
              <br />
              carry <em>with you?</em>
            </h1>
            <p className="lede">
              A value to reflect on. A tone for the telling.
            </p>
            <fieldset>
              <legend>What matters most to you?</legend>
              <div className="pills">
                {values.map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={data.value === value}
                    className={data.value === value ? "selected" : ""}
                    onClick={() => field("value", value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>How should this story feel?</legend>
              <div className="tone-grid">
                {tones.map((tone) => (
                  <button
                    type="button"
                    key={tone}
                    aria-pressed={data.tone === tone}
                    className={data.tone === tone ? "selected" : ""}
                    onClick={() => field("tone", tone)}
                  >
                    {tone}
                    <small>
                      {
                        {
                          Hopeful: "Notice the light",
                          Bittersweet: "Hold both feelings",
                          Mysterious: "Leave room for wonder",
                          Realistic: "Stay close to the everyday",
                        }[tone]
                      }
                    </small>
                  </button>
                ))}
              </div>
            </fieldset>
            <p className="fineprint">
              These preferences add perspective, not personality scores. There
              are no right answers.
            </p>
          </>
        )}
        <div className="setup-actions">
          <button className="primary" type="submit">
            {step === 2 ? "Step Into This Life" : "Continue"}
            <ArrowRight size={17} />
          </button>
          {step === 0 && (
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setData({ ...defaultSetup, scenario: initialScenario });
                setStep(1);
              }}
            >
              Skip for now
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
