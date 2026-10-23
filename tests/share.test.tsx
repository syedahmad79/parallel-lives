import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Share from "../src/Share";
import { choose, createStory, defaultSetup } from "../src/engine";
const finished = () => {
  let s = createStory(
    { ...defaultSetup, name: "PrivateName", custom: "My private crossroads" },
    1,
  );
  for (const id of ["work", "visit", "promotion", "family", "stay"])
    s = choose(s, id);
  return s;
};
afterEach(() => vi.restoreAllMocks());
describe("sharing failure and privacy behavior", () => {
  it("exposes selectable text when clipboard permission fails and omits personal inputs", async () => {
    const user = userEvent.setup();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("Denied"),
    );
    const notify = vi.fn();
    render(<Share story={finished()} notify={notify} />);
    await user.click(screen.getByRole("button", { name: "Copy summary" }));
    const text = await screen.findByLabelText("Select and copy this summary");
    expect((text as HTMLTextAreaElement).value).toContain("PARALLEL");
    expect((text as HTMLTextAreaElement).value).not.toContain("PrivateName");
    expect((text as HTMLTextAreaElement).value).not.toContain(
      "My private crossroads",
    );
    expect(notify).not.toHaveBeenCalledWith("Story summary copied.");
  });
  it("reports a canceled native share without claiming success", async () => {
    const user = userEvent.setup();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: vi
        .fn()
        .mockRejectedValue(new DOMException("Canceled", "AbortError")),
    });
    const notify = vi.fn();
    render(<Share story={finished()} notify={notify} />);
    await user.click(screen.getByRole("button", { name: "Share" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Sharing canceled."),
    );
    expect(notify).not.toHaveBeenCalledWith(
      "The browser completed the share request.",
    );
    delete (navigator as unknown as Record<string, unknown>).share;
  });
});
