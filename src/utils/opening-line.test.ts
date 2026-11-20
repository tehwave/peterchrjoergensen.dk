import { describe, expect, it } from "vitest";
import { getOpeningLine, renderOpeningLine } from "./opening-line";

describe("getOpeningLine", () => {
  it("returns the first sentence of the first paragraph, after MDX imports", () => {
    const body = [
      "",
      'import RelatedContent from "../../components/RelatedContent.astro";',
      "",
      "I kept missing bites when fishing in World of Warcraft. I'd look away for a second, the bobber would splash.",
      "",
      "On a Saturday evening I asked Claude to make an addon for it.",
    ].join("\n");

    expect(getOpeningLine(body)).toBe("I kept missing bites when fishing in World of Warcraft.");
  });

  it("keeps inline code whole, even when it contains a full stop", () => {
    expect(getOpeningLine("Open the `.app` bundle to find it. Then copy the path.")).toBe("Open the `.app` bundle to find it.");
  });

  it("skips headings, components, code fences, lists and images before the first paragraph", () => {
    const body = ["## Setup", "", "<Figure src={hero} />", "", "```zsh", "godot() { echo. }", "```", "", "- a list item.", "", "![An image.](./a.png)", "", "The first real line. The second."].join(
      "\n",
    );

    expect(getOpeningLine(body)).toBe("The first real line.");
  });

  it("joins a paragraph that wraps over several lines", () => {
    expect(getOpeningLine("A sentence that wraps\nonto a second line. Another one.")).toBe("A sentence that wraps onto a second line.");
  });

  it("returns the whole paragraph when it has no sentence ending", () => {
    expect(getOpeningLine("Just a phrase")).toBe("Just a phrase");
  });

  it("returns undefined when the body has no paragraph", () => {
    expect(getOpeningLine('import A from "./a";\n\n## Only a heading')).toBeUndefined();
    expect(getOpeningLine("")).toBeUndefined();
  });
});

describe("renderOpeningLine", () => {
  it("escapes HTML, renders inline code and keeps only the text of links and emphasis", () => {
    expect(renderOpeningLine("I use <b> & `godot` with [Claude](https://claude.ai) and **bold** _words_.")).toBe("I use &lt;b&gt; &amp; <code>godot</code> with Claude and bold words.");
  });
});
