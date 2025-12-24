import type { CellSchema } from "tinybase/with-schemas";
import type { ZodType as ZodSchema, ZodFirstPartySchemaTypes } from "zod";
import z from "zod";

export function zObjectToTinyTable(
  zodSchema: z.ZodObject<Record<string, ZodSchema>>
) {
  const keys = zodSchema.keyof().options;
  const rows: Record<string, CellSchema> = {};
  keys.forEach((key) => {
    const typeString = zodTypeString(zodSchema.shape[key]);
    rows[key] = { type: typeString };
  });

  return rows;
}

function zodTypeString(zodSchema: ZodSchema): "string" | "number" | "boolean" {
  const typedSchema = zodSchema as ZodFirstPartySchemaTypes;
  switch (typedSchema._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodString: // The case statement does not have a shared enum type with the switch predicate.
      return "string";
    case z.ZodFirstPartyTypeKind.ZodNumber:
      return "number";
    case z.ZodFirstPartyTypeKind.ZodBoolean:
      return "boolean";
    case z.ZodFirstPartyTypeKind.ZodOptional:
      return zodTypeString((zodSchema as z.ZodOptional<ZodSchema>).unwrap());
    case z.ZodFirstPartyTypeKind.ZodEffects:
      return zodTypeString((zodSchema as z.ZodEffects<ZodSchema>).innerType());
    case z.ZodFirstPartyTypeKind.ZodLiteral: {
      const value = typeof typedSchema._def.value;
      if (value === "boolean" || value === "string" || value === "number")
        return value;
      throw Error(`${typedSchema._def.value} not supported by tinyBase`);
    }
    default:
      throw Error(`${typedSchema._def.typeName} not supported by tinyBase`);
  }
}
