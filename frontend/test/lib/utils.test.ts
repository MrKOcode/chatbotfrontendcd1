import { cn } from "@/lib/utils";

describe("cn", () => {
  it("combines conditional classes and resolves Tailwind conflicts", () => {
    const showHidden = false;
    expect(cn("px-2", showHidden && "hidden", ["font-bold", "px-4"])).toBe(
      "font-bold px-4",
    );
  });
});
