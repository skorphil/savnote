import type { JournalSchema2 } from "../model/journalSchema2";
import { validateJournal } from "../model/validateJournal";

/**
 * Validate provided text against journalSchema
 * @param journalData string expected to be journal data
 * @returns validated journal object
 */
export function journalFromString(journalData: string): JournalSchema2 {
  if (typeof journalData !== "string")
    throw Error("Can't read a journal. Is it in SavNote format?");
  if (
    typeof JSON.parse(journalData) !== "object" ||
    JSON.parse(journalData) === null
  )
    throw Error("Can't read a journal. Is it in SavNote format?");
  return validateJournal(JSON.parse(journalData) as object);
}
