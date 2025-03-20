import { ZodError } from "zod";
import { type JournalSchema1, journalSchema1 } from "./journalSchema1";
import { throwError } from "../lib/throwError";

export function validateJournal(data: object): JournalSchema1 {
  try {
    return journalSchema1.parse(data);
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
