import { ZodError } from "zod";
import {
  journalSchema,
  recordsSchema,
  type RecordsSchema,
  type JournalSchema,
} from "@/shared/journal-schema";
import { throwError } from "@/shared/lib/error-handling";

export function validateJournal(data: object): JournalSchema {
  try {
    return journalSchema.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      throw Error(
        `Can't read a journal. Is it in SavNote format? ${JSON.stringify(
          e.errors
        )}`
      );
    } else {
      throwError(e);
    }
  }
}
export function validateRecord(data: object): RecordsSchema {
  try {
    return recordsSchema.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      throw Error(
        `Can't read a record. Is it in SavNote format? ${JSON.stringify(
          e.errors
        )}`
      );
    } else {
      throwError(e);
    }
  }
}
