import { useEffect, useRef, useState } from "react";
import { Copy, Download, Share2 } from "lucide-react";
import type { Story } from "./model";
import { endingFor } from "./engine";
import { getScenario } from "./stories";
import { downloadBlob } from "./storage";
function publicUrl() {
  return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)
    ? ""
    : `${location.origin}${location.pathname}`;
}
export default function Share({
  story,
  notify: onNotify,
}: {
  story: Story;
  notify: (s: string) => void;
}) {
  const [feedback, setFeedback] = useState("");
  function notify(message: string) {
    setFeedback(message);
    onNotify(message);
  }
  const canvas = useRef<HTMLCanvasElement>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);
  const end = endingFor(story)!;
  const scenario = getScenario(story.setup.scenario);
  const url = publicUrl();
  const summary = `PARALLEL — ${end.title}\n“${end.quote}”\n${scenario.title}\nA fictional exploration of possibility, not a prediction.${url ? "\n" + url : ""}`;
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) {
      setError(
        "Image rendering is unavailable. You can still copy the story summary.",
      );
      return;
    }
    let alive = true;
    el.width = 1200;
    el.height = 1500;
    ctx.fillStyle = "#0b0d18";
    ctx.fillRect(0, 0, 1200, 1500);
    const glow = ctx.createRadialGradient(600, 600, 10, 600, 600, 650);
    glow.addColorStop(0, "#252235");
    glow.addColorStop(1, "#0b0d18");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1200, 1500);
    ctx.strokeStyle = "#504763";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(600, 830);
      ctx.bezierCurveTo(600, 550, 200 + i * 200, 550, 200 + i * 200, 120);
      ctx.stroke();
      ctx.fillStyle = "#d8bf92";
      ctx.beginPath();
      ctx.arc(200 + i * 200, 300 + i * 25, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#ece7dc";
    ctx.textAlign = "center";
    ctx.font = "24px sans-serif";
    ctx.letterSpacing = "10px";
    ctx.fillText("PARALLEL", 600, 105);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = "#d8bf92";
    ctx.font = "20px sans-serif";
    ctx.fillText(scenario.title.toUpperCase(), 600, 860);
    function wrapped(
      text: string,
      y: number,
      font: string,
      width: number,
      line: number,
    ) {
      ctx!.font = font;
      const words = text.split(" ");
      let row = "";
      for (const word of words) {
        const next = row ? row + " " + word : word;
        if (ctx!.measureText(next).width > width && row) {
          ctx!.fillText(row, 600, y);
          y += line;
          row = word;
        } else row = next;
      }
      ctx!.fillText(row, 600, y);
      return y + line;
    }
    ctx.fillStyle = "#f1ece3";
    let y = wrapped(end.title, 960, "64px Georgia", 980, 78);
    ctx.fillStyle = "#b8b4c3";
    y = wrapped("“" + end.quote + "”", y + 40, "italic 30px Georgia", 920, 44);
    ctx.font = "18px sans-serif";
    ctx.fillText(
      "A fictional exploration of possibility. Not a prediction.",
      600,
      1320,
    );
    ctx.fillStyle = "#d8bf92";
    ctx.fillText(url || "Explore the lives you never lived.", 600, 1380);
    ctx.fillStyle = "#aaa7b6";
    ctx.font = "16px sans-serif";
    ctx.fillText("Made by Syed Ahmad Geelani", 600, 1440);
    el.toBlob((b) => {
      if (!alive) return;
      if (b) setBlob(b);
      else setError("Could not render the image. Try copying the summary.");
    }, "image/png");
    return () => {
      alive = false;
    };
  }, [end, scenario.title, url]);
  async function copy() {
    setFallback(true);
    try {
      await navigator.clipboard.writeText(summary);
      notify("Story summary copied.");
    } catch {
      setFallback(true);
      notify(
        "Clipboard access is unavailable. Select and copy the summary below.",
      );
    }
  }
  async function share() {
    try {
      const file = blob
        ? new File([blob], "parallel-life.png", { type: "image/png" })
        : null;
      await navigator.share(
        file && navigator.canShare?.({ files: [file] })
          ? { title: end.title, text: summary, files: [file] }
          : { title: end.title, text: summary },
      );
      notify("The browser completed the share request.");
    } catch (e) {
      if (e && typeof e === "object" && "name" in e && e.name === "AbortError")
        notify("Sharing canceled.");
      else {
        setFallback(true);
        notify(
          "Sharing was unavailable. You can download the card or copy its summary.",
        );
      }
    }
  }
  return (
    <div className="share-content">
      <span className="eyebrow gold">A POSTCARD FROM ELSEWHERE</span>
      <h2>
        Share this <em>possibility.</em>
      </h2>
      <p>Your name, private answers, and decision history stay off the card.</p>
      <canvas
        className="share-preview"
        ref={canvas}
        aria-label={`Share card: ${end.title}`}
      />
      {error && <p role="alert">{error}</p>}
      {feedback && (
        <p className="share-feedback" role="status">
          {feedback}
        </p>
      )}
      <div className="share-actions">
        <button
          className="primary"
          disabled={!blob}
          onClick={() => {
            if (blob) {
              downloadBlob(blob, "parallel-life.png");
              notify("PNG prepared for download.");
            }
          }}
        >
          <Download size={16} />
          Download PNG
        </button>
        {typeof navigator.share === "function" && (
          <button className="secondary" onClick={() => void share()}>
            <Share2 size={16} />
            Share
          </button>
        )}
        <button className="secondary" onClick={() => void copy()}>
          <Copy size={16} />
          Copy summary
        </button>
      </div>
      {fallback && (
        <>
          <label htmlFor="share-summary">Select and copy this summary</label>
          <textarea
            id="share-summary"
            readOnly
            value={summary}
            onFocus={(e) => e.target.select()}
          />
        </>
      )}
      <p className="fineprint">
        {url
          ? "The card includes this site’s URL, with no personal information."
          : "A public URL will be included automatically when hosted on a public domain."}
      </p>
    </div>
  );
}
