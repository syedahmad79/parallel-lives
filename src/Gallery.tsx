import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  Orbit,
} from "lucide-react";
import type { Story } from "./model";
import { endingFor, parseArchive } from "./engine";
import { archive, downloadBlob, mergeLives } from "./storage";
import { getScenario } from "./stories";
import Timeline from "./Timeline";
export default function Gallery({
  stories,
  onChange,
  onOpen,
  onReplay,
  onNew,
  notify,
}: {
  stories: Story[];
  onChange: (s: Story[]) => void;
  onOpen: (s: Story) => void;
  onReplay: (s: Story) => void;
  onNew: () => void;
  notify: (s: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [remove, setRemove] = useState<string | null>(null);
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 1_000_000) throw new Error("Choose a file under 1 MB.");
      const imported = parseArchive(await file.text());
      const merged = mergeLives(stories, imported);
      onChange(merged);
      notify(
        `${merged.length - stories.length} new ${merged.length - stories.length === 1 ? "life" : "lives"} imported. Existing IDs were kept.`,
      );
    } catch (e) {
      notify(e instanceof Error ? e.message : "Import failed.");
    } finally {
      if (input.current) input.current.value = "";
    }
  }
  return (
    <section className="screen gallery">
      <div className="gallery-heading">
        <div>
          <span className="eyebrow gold">YOUR PRIVATE CONSTELLATION</span>
          <h1>
            Lives you’ve <em>lived.</em>
          </h1>
          <p className="lede">
            Different decisions. Other versions of you. All here, on this
            device.
          </p>
        </div>
        <Orbit size={48} strokeWidth={0.6} />
      </div>
      <div className="gallery-toolbar">
        <span>
          {stories.length.toString().padStart(2, "0")} SAVED{" "}
          {stories.length === 1 ? "LIFE" : "LIVES"}
        </span>
        <div>
          <button
            className="text-button"
            onClick={() => input.current?.click()}
          >
            <Upload size={16} />
            Import JSON
          </button>
          <button
            className="text-button"
            disabled={!stories.length}
            onClick={() => {
              downloadBlob(
                new Blob([JSON.stringify(archive(stories), null, 2)], {
                  type: "application/json",
                }),
                "parallel-lives.json",
              );
              notify(
                "Export prepared. It includes your setup answers; keep the file private.",
              );
            }}
          >
            <Download size={16} />
            Export JSON
          </button>
        </div>
        <input
          aria-label="Import saved lives"
          type="file"
          accept=".json,application/json"
          ref={input}
          hidden
          onChange={(e) => void importFile(e.target.files?.[0])}
        />
      </div>
      {stories.length ? (
        <div className="gallery-grid">
          {stories.map((story) => {
            const end = endingFor(story)!;
            const scenario = getScenario(story.setup.scenario);
            return (
              <article
                className="saved-card"
                key={story.id}
                style={
                  { "--story-color": scenario.color } as React.CSSProperties
                }
              >
                <div className="eyebrow">
                  {scenario.title} ·{" "}
                  {new Date(story.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <Timeline story={story} compact />
                <h2>{end.title}</h2>
                <p>{end.quote}</p>
                <p className="saved-summary">{end.paragraphs[0]}</p>
                <button
                  className="text-button gold"
                  onClick={() => onOpen(story)}
                >
                  Reopen this life
                  <ArrowUpRight size={16} />
                </button>
                <div className="saved-actions">
                  <button
                    className="text-button"
                    onClick={() => onReplay(story)}
                  >
                    <RotateCcw size={14} />
                    Replay
                  </button>
                  <button
                    className="text-button"
                    aria-label={`Delete ${end.title}`}
                    onClick={() => setRemove(story.id)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
                {remove === story.id && (
                  <div
                    className="delete-confirm"
                    role="group"
                    aria-label="Confirm deletion"
                  >
                    <p>Remove this life from this browser?</p>
                    <button
                      className="text-button"
                      onClick={() => {
                        onChange(stories.filter((s) => s.id !== story.id));
                        setRemove(null);
                        notify("Life removed from your gallery.");
                      }}
                    >
                      Yes, delete
                    </button>
                    <button
                      className="text-button"
                      onClick={() => setRemove(null)}
                    >
                      Keep it
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-gallery">
          <Orbit size={64} strokeWidth={0.5} />
          <h2>A universe, still unwritten.</h2>
          <p>
            Finish a journey and save it here.
            <br />
            Your first alternate life is one decision away.
          </p>
          <button className="primary" onClick={onNew}>
            Explore a life
            <ArrowUpRight size={17} />
          </button>
        </div>
      )}
      <p className="fineprint gallery-note">
        Saved only in this browser · Up to 100 lives · Clearing browser data
        removes your collection. JSON backups include your private setup
        answers.
      </p>
    </section>
  );
}
