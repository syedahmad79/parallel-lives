import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronRight,
  Compass,
  Feather,
  GitBranch,
  Globe2,
  Menu,
  Orbit,
  Play,
  RotateCcw,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Story, ScenarioId } from "./model";
import { attributes } from "./model";
import {
  choose,
  createStory,
  derive,
  eligible,
  endingFor,
  framing,
  rewind,
} from "./engine";
import { getScenario, scenarios } from "./stories";
import {
  ACTIVE_KEY,
  GALLERY_KEY,
  MOTION_KEY,
  archive,
  readData,
  saveLife,
  writeData,
} from "./storage";
import Atmosphere, { BranchArt } from "./Atmosphere";
import Setup from "./Setup";
import Timeline from "./Timeline";
const Gallery = lazy(() => import("./Gallery"));
const Share = lazy(() => import("./Share"));
type Page = "home" | "setup" | "story" | "gallery";
function Modal({
  children,
  title,
  onClose,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    const d = ref.current;
    return () => d?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-shell">
        <button
          className="icon-button close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
export default function App() {
  const [setupScenario, setSetupScenario] = useState<ScenarioId>("abroad");
  const [storageWarning, setStorageWarning] = useState("");
  const [loaded] = useState(readData);
  const [story, setStory] = useState<Story | null>(loaded.active);
  const [gallery, setGallery] = useState(loaded.gallery);
  const [page, setPage] = useState<Page>("home");
  const [notice, setNotice] = useState(loaded.warning);
  const [how, setHow] = useState(false);
  const [share, setShare] = useState(false);
  const [inspect, setInspect] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [sound, setSound] = useState(false);
  const [still, setStill] = useState(() => {
    try {
      return localStorage.getItem(MOTION_KEY) === "true";
    } catch {
      return false;
    }
  });
  const systemReduced = useReducedMotion();
  const reduced = still || !!systemReduced;
  const audioRef = useRef<AudioContext | null>(null);
  const main = useRef<HTMLElement>(null);
  const [confirmNew, setConfirmNew] = useState(false);
  const state = story ? derive(story) : null;
  const scenario = story ? getScenario(story.setup.scenario) : null;
  const end = story ? endingFor(story) : null;
  const scene =
    scenario && state && !state.complete ? scenario.scenes[state.step] : null;
  const frame = story ? framing(story) : null;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    main.current?.focus({ preventScroll: true });
    setMenu(false);
  }, [page, story?.id, story?.history.length]);
  useEffect(
    () => () => {
      void audioRef.current?.close();
    },
    [],
  );
  function updateStory(next: Story) {
    setStory(next);
    const warning = writeData(ACTIVE_KEY, next);
    if (warning) setStorageWarning(warning);
  }
  function updateGallery(next: Story[]) {
    setGallery(next);
    const warning = writeData(GALLERY_KEY, archive(next));
    if (warning) setStorageWarning(warning);
    return warning;
  }
  function newLife() {
    if (story && !derive(story).complete && story.history.length) {
      setConfirmNew(true);
    } else setPage("setup");
  }
  async function toggleSound() {
    if (sound) {
      await audioRef.current?.close();
      audioRef.current = null;
      setSound(false);
      return;
    }
    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;
      await ctx.resume();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.018, ctx.currentTime + 2);
      gain.connect(ctx.destination);
      [130.81, 196, 261.63].forEach((hz, i) => {
        const oscillator = ctx.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = hz + i * 0.15;
        oscillator.connect(gain);
        oscillator.start();
      });
      setSound(true);
    } catch {
      void audioRef.current?.close();
      audioRef.current = null;
      setNotice("Ambient audio is unavailable in this browser.");
    }
  }
  function chooseNow(id: string) {
    if (!story) return;
    try {
      const next = choose(story, id);
      updateStory(next);
      const last = scenario!.scenes[state!.step].choices.find(
        (c) => c.id === id,
      )!;
      setNotice(last.consequence);
    } catch (e) {
      setNotice((e as Error).message);
    }
  }
  function save() {
    if (!story) return;
    try {
      const next = saveLife(gallery, story);
      const warning = updateGallery(next);
      setNotice(warning || "This life is saved in your gallery.");
    } catch (e) {
      setNotice((e as Error).message);
    }
  }
  const saved = !!story && gallery.some((s) => s.id === story.id);
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      <div className={`app ${reduced ? "reduce-motion" : ""}`}>
        <Atmosphere reduced={reduced} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className="site-header">
          <button
            className="wordmark"
            onClick={() => setPage("home")}
            aria-label="PARALLEL home"
          >
            <GitBranch size={25} strokeWidth={1.2} />
            <span>PARALLEL</span>
          </button>
          <nav className={menu ? "open" : ""} aria-label="Main navigation">
            <button
              className={page === "gallery" ? "nav-link active" : "nav-link"}
              onClick={() => setPage("gallery")}
            >
              <Orbit size={16} />
              My universes{" "}
              <span className="nav-count">
                {gallery.length.toString().padStart(2, "0")}
              </span>
            </button>
            <span className="nav-divider" />
            <button
              className="nav-link sound"
              onClick={() => void toggleSound()}
              aria-pressed={sound}
            >
              {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>Sound {sound ? "on" : "off"}</span>
            </button>
            <button
              className="icon-button motion-toggle"
              aria-label={
                still ? "Enable motion where system allows" : "Reduce motion"
              }
              aria-pressed={reduced}
              title="Reduce motion"
              onClick={() => {
                setStill(!still);
                const warning = writeData(MOTION_KEY, !still);
                if (warning) setStorageWarning(warning);
              }}
            >
              <Sparkles size={16} />
            </button>
          </nav>
          <button
            className="icon-button mobile-sound"
            aria-label={sound ? "Turn sound off" : "Turn sound on"}
            aria-pressed={sound}
            onClick={() => void toggleSound()}
          >
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <button
            className="icon-button mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Menu size={22} />
          </button>
        </header>
        <main id="main" ref={main} tabIndex={-1}>
          {storageWarning && (
            <p className="storage-warning" role="alert">
              {storageWarning}
            </p>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.28 }}
            >
              {page === "home" && (
                <>
                  <section className="hero">
                    <div className="hero-art">
                      <BranchArt />
                    </div>
                    <div className="hero-content">
                      <div className="hero-kicker">
                        <span className="live-dot" /> AN INTERACTIVE EXPLORATION
                        OF POSSIBILITY
                      </div>
                      <p className="hero-brand">PARALLEL</p>
                      <h1>
                        Somewhere, another version of you
                        <br className="desktop-break" /> made a{" "}
                        <em>different choice.</em>
                      </h1>
                      <p className="hero-description">
                        One decision. A thousand possibilities.
                        <br />
                        Explore the lives you never lived.
                      </p>
                      <div className="hero-actions">
                        <button className="primary" onClick={newLife}>
                          Enter Another Life
                          <ArrowUpRight size={18} />
                        </button>
                        <button
                          className="text-button"
                          onClick={() => setHow(true)}
                        >
                          <Play size={13} />
                          How It Works
                        </button>
                      </div>
                      {story && (
                        <button
                          className="resume"
                          onClick={() => setPage("story")}
                        >
                          Return to your{" "}
                          {state?.complete ? "last life" : "unfinished life"}
                          <ArrowRight size={14} />
                        </button>
                      )}
                      <div className="hero-note">
                        <span /> FICTIONAL LIVES. REAL MOMENTS OF REFLECTION.{" "}
                        <span />
                      </div>
                    </div>
                    <div className="hero-bottom">
                      <span>01 — THE POSSIBILITY OF YOU</span>
                      <a href="#crossroads">
                        CHOOSE YOUR CROSSROADS <span>↓</span>
                      </a>
                      <span>NO ACCOUNT. JUST CURIOSITY.</span>
                    </div>
                  </section>
                  <section id="crossroads" className="crossroads-section">
                    <div className="section-heading">
                      <div>
                        <span className="eyebrow gold">
                          THREE DOORS. MANY WAYS THROUGH.
                        </span>
                        <h2>
                          Some questions <em>stay with us.</em>
                        </h2>
                      </div>
                      <p>
                        Five turning points in each life.
                        <br />
                        Nothing to get right. Something to discover.
                      </p>
                    </div>
                    <div className="world-grid">
                      {scenarios.map((s, i) => {
                        const Icon = [Globe2, Feather, Compass][i];
                        return (
                          <button
                            className={`world-card world-${s.id}`}
                            key={s.id}
                            onClick={() => {
                              setSetupScenario(s.id);
                              newLife();
                            }}
                          >
                            <div className="world-art">
                              <svg viewBox="0 0 360 150" aria-hidden="true">
                                {[0, 1, 2, 3, 4].map((j) => (
                                  <path
                                    key={j}
                                    d={
                                      i === 0
                                        ? `M${80 + j * 30} 150Q${120 + j * 20} 80 ${60 + j * 60} 15`
                                        : i === 1
                                          ? `M40 ${140 - j * 15}Q180 ${-20 + j * 40} 320 ${140 - j * 15}`
                                          : `M180 150V90Q180 ${70 - j * 10} ${35 + j * 70} ${15 + (j % 2) * 20}`
                                    }
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth=".8"
                                    opacity={0.25 + j * 0.13}
                                  />
                                ))}
                                <circle
                                  cx={i === 0 ? 180 : i === 1 ? 180 : 180}
                                  cy={i === 0 ? 65 : i === 1 ? 75 : 90}
                                  r="3"
                                  fill="currentColor"
                                />
                              </svg>
                              <Icon size={24} strokeWidth={1} />
                            </div>
                            <span className="eyebrow">
                              0{i + 1} / {s.location}
                            </span>
                            <h3>{s.title}</h3>
                            <p>{s.subtitle}</p>
                            <span className="card-link">
                              Explore this possibility
                              <ArrowUpRight size={17} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="honesty-note">
                      Authored stories, shaped by your choices. No AI
                      generation. No predictions. Your answers stay on your
                      device.
                    </p>
                  </section>
                </>
              )}
              {page === "setup" && (
                <Setup
                  initialScenario={setupScenario}
                  onBack={() => setPage("home")}
                  onStart={(setup) => {
                    updateStory(createStory(setup));
                    setNotice("");
                    setPage("story");
                  }}
                />
              )}
              {page === "story" && story && scenario && state && frame && (
                <section
                  className={`screen story-screen ${end ? "ending-screen" : ""}`}
                >
                  <div className="story-top">
                    <span className="eyebrow">
                      <span className="small-orbit" />{" "}
                      {scenario.title.toUpperCase()}
                    </span>
                    <button className="text-button" onClick={newLife}>
                      <RotateCcw size={14} />
                      Another life
                    </button>
                  </div>
                  <div className="reader-layout">
                    <article className="story-article">
                      {scene ? (
                        <>
                          <div className="eyebrow gold">
                            CHAPTER 0{state.step + 1}{" "}
                            <span className="muted">
                              / 05 · {scene.time.toUpperCase()}
                            </span>
                          </div>
                          <h1>{scene.title}</h1>
                          {state.step === 0 && (
                            <div className="prologue">
                              <p>
                                {story.setup.name
                                  ? `${story.setup.name}, this`
                                  : "This"}{" "}
                                is one life you might imagine.
                              </p>
                              {story.setup.custom && (
                                <blockquote>“{story.setup.custom}”</blockquote>
                              )}
                              <p>{scenario.intro}</p>
                              <small>{frame.chapter}</small>
                            </div>
                          )}
                          <motion.div
                            key={scene.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.35 }}
                            className="story-prose"
                          >
                            {scene.body.map((p) => (
                              <p key={p}>{p}</p>
                            ))}
                            {scene.echoes
                              .filter((e) => eligible(e.when, state))
                              .map((e) => (
                                <p key={e.text} className="echo">
                                  <GitBranch size={15} />
                                  {e.text}
                                </p>
                              ))}
                            <p className="atmospheric-line">
                              {frame.motif} {frame.tone}
                            </p>
                          </motion.div>
                          <fieldset className="decisions">
                            <legend>WHAT DO YOU CHOOSE?</legend>
                            {scene.choices.map((c, i) => {
                              const available = eligible(c.requires, state);
                              return (
                                <button
                                  key={c.id}
                                  className="choice"
                                  disabled={!available}
                                  onClick={() => chooseNow(c.id)}
                                >
                                  <span className="choice-number">
                                    0{i + 1}
                                  </span>
                                  <span>
                                    <strong>{c.label}</strong>
                                    <small>
                                      {available ? c.detail : c.unavailable}
                                    </small>
                                  </span>
                                  <ChevronRight size={18} />
                                </button>
                              );
                            })}
                          </fieldset>
                          <p className="fineprint">
                            Every path asks for something. You can revisit any
                            reached decision.
                          </p>
                        </>
                      ) : (
                        end && (
                          <>
                            <div className="eyebrow gold">
                              YOUR PARALLEL LIFE · THE REVEAL
                            </div>
                            <div className="ending-symbol">
                              <Orbit size={56} strokeWidth={0.6} />
                            </div>
                            <h1>{end.title}</h1>
                            <blockquote className="ending-quote">
                              “{end.quote}”
                            </blockquote>
                            <div className="story-prose">
                              {end.paragraphs.map((p) => (
                                <p key={p}>{p}</p>
                              ))}
                            </div>
                            <div className="path-echo">
                              <span className="eyebrow gold">
                                THE SHAPE OF YOUR CHOICES
                              </span>
                              <p>
                                {
                                  scenario.scenes[0].choices.find(
                                    (c) => c.id === story.history[0],
                                  )?.consequence
                                }{" "}
                                {
                                  scenario.scenes[3].choices.find(
                                    (c) => c.id === story.history[3],
                                  )?.consequence
                                }
                              </p>
                            </div>
                            <div className="reflection">
                              <span className="eyebrow gold">
                                SOMETHING TO TAKE WITH YOU
                              </span>
                              <p>{end.reflection}</p>
                              <small>
                                You brought {story.setup.value.toLowerCase()} to
                                this crossroads. Where did it find a place in
                                this life?
                              </small>
                            </div>
                            <div className="ending-actions">
                              <button className="primary" onClick={save}>
                                {saved ? (
                                  <Check size={16} />
                                ) : (
                                  <Bookmark size={16} />
                                )}{" "}
                                {saved
                                  ? "Saved in My Universes"
                                  : "Save This Life"}
                              </button>
                              <button
                                className="secondary"
                                onClick={() => setShare(true)}
                              >
                                <Share2 size={16} />
                                Share My Parallel Life
                              </button>
                              <button
                                className="secondary"
                                onClick={() => setInspect(0)}
                              >
                                <GitBranch size={16} />
                                Revisit a Decision
                              </button>
                              <button className="text-button" onClick={newLife}>
                                Explore Another Timeline
                                <ArrowRight size={16} />
                              </button>
                            </div>
                            <p className="disclaimer">
                              This is a fictional exploration of possibility,
                              not a prediction of your future.
                            </p>
                            <details className="journey-details">
                              <summary>
                                Your decisions & their consequences
                              </summary>
                              <ol>
                                {story.history.map((id, i) => {
                                  const choice = scenario.scenes[
                                    i
                                  ].choices.find((c) => c.id === id)!;
                                  return (
                                    <li key={id}>
                                      <button
                                        className="text-button gold"
                                        onClick={() => setInspect(i)}
                                      >
                                        {scenario.scenes[i].time} ·{" "}
                                        {choice.label}
                                        <ArrowUpRight size={14} />
                                      </button>
                                      <p>{choice.consequence}</p>
                                    </li>
                                  );
                                })}
                              </ol>
                            </details>
                          </>
                        )
                      )}
                      <details className="attribute-details">
                        <summary>What this life is carrying</summary>
                        <p className="fineprint">
                          Fictional story resources, not measurements of you.
                          Choices change these values and can open an ending.
                        </p>
                        <div className="attributes">
                          {attributes.map((a) => (
                            <div key={a}>
                              <span>{a}</span>
                              <meter
                                min={0}
                                max={20}
                                value={state.stats[a]}
                                aria-label={a}
                              />
                              <span>{state.stats[a]}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </article>
                    <Timeline story={story} onInspect={setInspect} />
                  </div>
                </section>
              )}
              {page === "gallery" && (
                <Suspense
                  fallback={<p className="loading">Opening your collection…</p>}
                >
                  <Gallery
                    stories={gallery}
                    onChange={(s) => {
                      updateGallery(s);
                    }}
                    onNew={newLife}
                    notify={setNotice}
                    onOpen={(s) => {
                      updateStory(s);
                      setPage("story");
                    }}
                    onReplay={(s) => {
                      updateStory(createStory(s.setup, s.seed));
                      setPage("story");
                    }}
                  />
                </Suspense>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="site-footer">
          <span className="footer-note">A FEW CHOICES. ANOTHER UNIVERSE.</span>
          <a
            href="https://www.linkedin.com/in/syedahmadgeelani"
            target="_blank"
            rel="noopener noreferrer"
          >
            Made by Syed Ahmad Geelani
          </a>
          <span className="footer-note">IMAGINED, NEVER PREDICTED.</span>
        </footer>
        {notice && (
          <div className="notice" role="status">
            <span>{notice}</span>
            <button
              className="icon-button"
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
            >
              <X size={16} />
            </button>
          </div>
        )}
        {how && (
          <Modal title="How PARALLEL works" onClose={() => setHow(false)}>
            <span className="eyebrow gold">A SMALL LEAP OF IMAGINATION</span>
            <h2>
              One choice.
              <br />
              <em>Then another.</em>
            </h2>
            <div className="how-steps">
              {[
                [
                  "Choose a crossroads",
                  "Step into one of three carefully authored lives. Add a name or a thought, if you like.",
                ],
                [
                  "Live with your decisions",
                  "Move through five turning points. Choices reshape your resources, relationships, and available endings.",
                ],
                [
                  "Look at what could be",
                  "Revisit a moment, follow a different branch, and save the lives that stay with you.",
                ],
              ].map(([title, body], i) => (
                <div key={title}>
                  <span>0{i + 1}</span>
                  <section>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </section>
                </div>
              ))}
            </div>
            <p className="disclaimer">
              Fiction, not a forecast. No AI generation, psychological
              profiling, account, or tracking. Everything happens in your
              browser.
            </p>
            <button
              className="primary"
              onClick={() => {
                setHow(false);
                newLife();
              }}
            >
              Enter Another Life
              <ArrowRight size={17} />
            </button>
          </Modal>
        )}
        {confirmNew && (
          <Modal
            title="Begin another life"
            onClose={() => setConfirmNew(false)}
          >
            <h2>
              A different <em>beginning?</em>
            </h2>
            <p>
              Your unfinished life stays available until you start the next
              story. Starting it replaces your current session. Saved lives
              remain in your gallery.
            </p>
            <button
              className="primary"
              onClick={() => {
                setConfirmNew(false);
                setPage("setup");
              }}
            >
              Choose another crossroads
              <ArrowRight size={16} />
            </button>
            <button
              className="text-button"
              onClick={() => setConfirmNew(false)}
            >
              Keep exploring this life
            </button>
          </Modal>
        )}
        {inspect !== null && story && scenario && state && (
          <Modal
            title={`Revisit ${scenario.scenes[inspect].title}`}
            onClose={() => setInspect(null)}
          >
            <span className="eyebrow gold">
              {scenario.scenes[inspect].time} · A TURNING POINT
            </span>
            <h2>{scenario.scenes[inspect].title}</h2>
            <p>{scenario.scenes[inspect].body[0]}</p>
            <div className="past-choices">
              {scenario.scenes[inspect].choices.map((c) => {
                const past = derive({
                  ...story,
                  history: story.history.slice(0, inspect),
                });
                const available = eligible(c.requires, past);
                return (
                  <div
                    key={c.id}
                    className={story.history[inspect] === c.id ? "chosen" : ""}
                  >
                    <span>
                      {story.history[inspect] === c.id ? (
                        <Check size={16} />
                      ) : (
                        <GitBranch size={16} />
                      )}
                    </span>
                    <div>
                      <strong>{c.label}</strong>
                      <p>
                        {story.history[inspect] === c.id
                          ? c.consequence
                          : available
                            ? "Unexplored · " + c.detail
                            : c.unavailable}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {inspect < state.step ? (
              <>
                <p className="fineprint">
                  Restarting here removes later decisions from your active
                  timeline. Any saved copy stays in your gallery.
                </p>
                <button
                  className="primary"
                  onClick={() => {
                    updateStory(rewind(story, inspect));
                    setInspect(null);
                    setNotice(
                      "A new branch begins here. Later consequences have been reset.",
                    );
                    setPage("story");
                  }}
                >
                  Restart from this moment
                  <RotateCcw size={16} />
                </button>
              </>
            ) : (
              <p className="gold">
                This is your present moment. Close this window to choose.
              </p>
            )}
          </Modal>
        )}
        {share && story && (
          <Modal
            title="Share your parallel life"
            onClose={() => setShare(false)}
          >
            <Suspense fallback={<p>Drawing your postcard…</p>}>
              <Share story={story} notify={setNotice} />
            </Suspense>
          </Modal>
        )}
      </div>
    </MotionConfig>
  );
}
