import { GitBranch, LockKeyhole } from "lucide-react";
import { derive } from "./engine";
import { getScenario } from "./stories";
import type { Story } from "./model";
export default function Timeline({
  story,
  onInspect,
  compact = false,
}: {
  story: Story;
  onInspect?: (index: number) => void;
  compact?: boolean;
}) {
  const scenario = getScenario(story.setup.scenario);
  const state = derive(story);
  if (compact)
    return (
      <svg
        viewBox="0 0 320 80"
        className="timeline-thumb"
        aria-label="Five decisions in this life"
      >
        <path d="M10 40H310" stroke="currentColor" opacity=".25" />
        {scenario.scenes.map((scene, i) => {
          const choice = Math.max(
            0,
            scene.choices.findIndex((c) => c.id === story.history[i]),
          );
          const x = 25 + i * 66,
            y = 20 + choice * 20;
          return (
            <g key={scene.id}>
              <path
                d={`M${x - 16} 40Q${x} 40 ${x} ${y}H${x + 16}`}
                stroke="currentColor"
                fill="none"
              />
              <circle cx={x} cy={y} r="3" fill="currentColor" />
            </g>
          );
        })}
      </svg>
    );
  return (
    <aside className="timeline-panel" aria-label="Your branching timeline">
      <div className="section-kicker">
        <GitBranch size={15} /> YOUR TIMELINE
      </div>
      <p className="timeline-intro">One life. A few turning points.</p>
      <ol className="timeline-list">
        {scenario.scenes.map((scene, i) => {
          const selected = scene.choices.find((c) => c.id === story.history[i]);
          const reached = i <= state.step;
          const branch = scene.choices.findIndex(
            (c) => c.id === story.history[i],
          );
          return (
            <li
              key={scene.id}
              className={`${selected ? "visited" : ""} ${i === state.step ? "current" : ""}`}
            >
              <svg viewBox="0 0 60 92" aria-hidden="true">
                <path d="M17 0V92" />
                <path d="M17 24Q17 40 48 40M17 24Q17 60 48 60" />
                <circle cx="17" cy="24" r="4" />
                <circle cx="48" cy="40" r="2" />
                <circle cx="48" cy="60" r="2" />
                {selected && (
                  <g className="selected-branch">
                    <path
                      d={
                        branch === 0
                          ? "M17 0V92"
                          : branch === 1
                            ? "M17 0V24Q17 40 48 40"
                            : "M17 0V24Q17 60 48 60"
                      }
                    />
                    <circle
                      cx={branch === 0 ? 17 : 48}
                      cy={branch === 0 ? 24 : branch === 1 ? 40 : 60}
                      r="3"
                    />
                  </g>
                )}
              </svg>
              <button
                disabled={!reached}
                onClick={() => onInspect?.(i)}
                aria-label={`Inspect decision ${i + 1}: ${scene.title}`}
              >
                <span className="timeline-time">
                  {scene.time} {!reached && <LockKeyhole size={10} />}
                </span>
                <span>{scene.title}</span>
                <small>
                  {selected?.label ??
                    (i === state.step ? "You are here" : "Unexplored")}
                </small>
              </button>
            </li>
          );
        })}
        <li className={state.complete ? "arrival reached" : "arrival"}>
          <span className="endpoint" />
          {state.complete ? "A life, imagined" : "A life waiting to unfold"}
        </li>
      </ol>
      <p className="fineprint">
        Select a reached moment to revisit it. Faint branches are authored
        choices you haven’t taken.
      </p>
    </aside>
  );
}
