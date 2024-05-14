import { expect, test } from "vitest";
import { cn } from "./utils";

test("shadcn/ui utils test", () => {
    const result = cn("myClass")
    expect(result).toBe("myClass")
})