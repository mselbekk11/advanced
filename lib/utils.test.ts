import { describe, expect, it } from "vitest"
import { cn } from "@/lib/utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1")
  })

  it("lets later Tailwind classes win over conflicting ones", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  it("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c")
  })
})
