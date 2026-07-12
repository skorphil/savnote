import type { CellSchema } from "tinybase/with-schemas";
import type { ZodType as ZodSchema } from "zod";
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
  const schema = zodSchema as any;
  const typeName = schema._def?.typeName;

  if (schema instanceof z.ZodString || typeName === "ZodString") {
    return "string";
  }
  if (schema instanceof z.ZodNumber || typeName === "ZodNumber") {
    return "number";
  }
  if (schema instanceof z.ZodBoolean || typeName === "ZodBoolean") {
    return "boolean";
  }
  if (schema instanceof z.ZodOptional || typeName === "ZodOptional") {
    return zodTypeString(schema.unwrap?.() || schema._def.innerType);
  }
  if (schema instanceof z.ZodDefault || typeName === "ZodDefault") {
    return zodTypeString(schema._def.innerType);
  }
  if (typeName === "ZodEffects") {
    return zodTypeString(schema._def.schema || schema.innerType?.());
  }
  if (schema instanceof z.ZodLiteral || typeName === "ZodLiteral") {
    const value = typeof schema._def.value;
    if (value === "boolean" || value === "string" || value === "number")
      return value as "string" | "number" | "boolean";
    throw Error(`${schema._def.value} not supported by tinyBase`);
  }

  throw Error(`${typeName || "unknown"} not supported by tinyBase (constructor: ${schema.constructor?.name})`);
}
