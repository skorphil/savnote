import { describe, it, expect } from "vitest";
import { zObjectToTinyTable } from "../zObjectToTinyTable";
import { z } from "zod";

/* ---------- CODE BLOCK: Test Data ---------- */
const correctSchema = z.object({
  property1: z.string().optional(),
  property2: z.boolean(),
  property3: z.number().int().optional(),
  property4: z
    .number()
    .refine((data) => data !== 5)
    .optional(),
  property5: z.literal(100),
  property6: z.literal("string"),
});

const wrongSchema = z.object({
  property1: z.object({ property: z.string() }).optional(),
  property2: z.null().optional(),
  property3: z.number().optional(),
  property4: z.literal(null),
});

/* ---------- CODE BLOCK: Test suite ---------- */
describe("zObjectToTinyTable", () => {
  it("must return tinyBaseRow compatible object, when correct zodSchema provided", () => {
    const expectedResult = {
      property1: { type: "string" },
      property2: { type: "boolean" },
      property3: { type: "number" },
      property4: { type: "number" },
      property5: { type: "number" },
      property6: { type: "string" },
    };

    const result = zObjectToTinyTable(correctSchema);
    expect(result).toStrictEqual(expectedResult);
  });

  it("must throw Error, when zodSchema with unsupported types provided", () => {
    try {
      zObjectToTinyTable(wrongSchema);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toContain("not");
    }
  });
});
