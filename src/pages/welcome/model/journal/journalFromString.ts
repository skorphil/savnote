import { ZodError } from "zod";
import { journalSchema1, type JournalSchema1 } from "../journalSchema1";
import { throwError } from "../../lib/throwError";

/**
 * Validate provided text against journalSchema
 * @param journalData string expected to be journal data
 * @returns validated journal object
 */
export function journalFromString(journalData: string): JournalSchema1 {
  if (typeof journalData !== "string")
    throw Error("Can't read a journal. Is it in SavNote format?");
  try {
    return journalSchema1.parse(JSON.parse(journalData));
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
