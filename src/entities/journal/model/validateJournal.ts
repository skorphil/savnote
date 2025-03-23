import { ZodError } from "zod";
import { journalSchema2, type JournalSchema2 } from "./journalSchema2";
import { throwError } from "@/shared/lib/error-handling";

export function validateJournal(data: object): JournalSchema2 {
  try {
    return journalSchema2.parse(data);
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
