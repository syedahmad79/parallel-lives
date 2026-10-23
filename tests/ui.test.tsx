import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Setup from "../src/Setup";
import Gallery from "../src/Gallery";
import Timeline from "../src/Timeline";
import { choose, createStory, defaultSetup } from "../src/engine";
import { vi } from "vitest";
describe("accessible interface interactions", () => {
  it("supports optional setup, scenario selection, tone, and a custom crossroads", async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(<Setup onStart={submit} onBack={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Skip for now" }));
    await user.click(
      screen.getByRole("button", { name: /Follow Your Passion/ }),
    );
    await user.click(
      screen.getByRole("button", { name: "Create your own crossroads" }),
    );
    await user.type(
      screen.getByLabelText("What decision is on your mind?"),
      "What if I painted again?",
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Creativity" }));
    await user.click(screen.getByRole("button", { name: /Hopeful/ }));
    await user.click(
      screen.getByRole("button", { name: "Step Into This Life" }),
    );
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        scenario: "passion",
        name: "",
        custom: "What if I painted again?",
        value: "Creativity",
        tone: "Hopeful",
      }),
    );
  });
  it("keeps reached timeline moments accessible and future moments disabled", async () => {
    const user = userEvent.setup();
    const inspect = vi.fn();
    const story = choose(createStory(defaultSetup, 4), "work");
    render(<Timeline story={story} onInspect={inspect} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeEnabled();
    expect(buttons[1]).toBeEnabled();
    expect(buttons[2]).toBeDisabled();
    await user.click(buttons[0]);
    expect(inspect).toHaveBeenCalledWith(0);
  });
  it("provides an actionable gallery empty state", async () => {
    const user = userEvent.setup();
    const onNew = vi.fn();
    render(
      <Gallery
        stories={[]}
        onChange={() => {}}
        onOpen={() => {}}
        onReplay={() => {}}
        onNew={onNew}
        notify={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Export JSON" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Explore a life" }));
    expect(onNew).toHaveBeenCalledOnce();
  });
  it("requires a deliberate confirmation to delete a saved life", async () => {
    const user = userEvent.setup();
    let s = createStory(defaultSetup, 1);
    for (const c of ["work", "visit", "promotion", "family", "stay"])
      s = choose(s, c);
    const onChange = vi.fn();
    render(
      <Gallery
        stories={[s]}
        onChange={onChange}
        onOpen={() => {}}
        onReplay={() => {}}
        onNew={() => {}}
        notify={() => {}}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Delete The Place/ }));
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Yes, delete" }));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith([]));
  });
});

describe("gallery import interface", () => {
  it("validates and imports a completed backup through its file input", async () => {
    const user = userEvent.setup();
    let s = createStory(defaultSetup, 1);
    for (const c of ["work", "visit", "promotion", "family", "stay"])
      s = choose(s, c);
    const change = vi.fn();
    const notify = vi.fn();
    render(
      <Gallery
        stories={[]}
        onChange={change}
        onOpen={() => {}}
        onReplay={() => {}}
        onNew={() => {}}
        notify={notify}
      />,
    );
    const file = new File(["backup"], "lives.json", {
      type: "application/json",
    });
    Object.defineProperty(file, "text", {
      value: async () =>
        JSON.stringify({ format: "parallel-lives", version: 1, stories: [s] }),
    });
    await user.upload(screen.getByLabelText("Import saved lives"), file);
    await waitFor(() => expect(change).toHaveBeenCalledWith([s]));
    expect(notify).toHaveBeenCalledWith(
      "1 new life imported. Existing IDs were kept.",
    );
  });
  it("rejects malformed files without changing the collection", async () => {
    const user = userEvent.setup();
    const change = vi.fn(),
      notify = vi.fn();
    render(
      <Gallery
        stories={[]}
        onChange={change}
        onOpen={() => {}}
        onReplay={() => {}}
        onNew={() => {}}
        notify={notify}
      />,
    );
    const file = new File(["invalid"], "broken.json", {
      type: "application/json",
    });
    Object.defineProperty(file, "text", { value: async () => "invalid" });
    await user.upload(screen.getByLabelText("Import saved lives"), file);
    await waitFor(() =>
      expect(notify).toHaveBeenCalledWith("This file is not valid JSON."),
    );
    expect(change).not.toHaveBeenCalled();
  });
});
