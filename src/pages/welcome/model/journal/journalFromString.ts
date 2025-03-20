import type { JournalSchema1 } from "../journalSchema1";
import { validateJournal } from "../validateJournal";

/**
 * Validate provided text against journalSchema
 * @param journalData string expected to be journal data
 * @returns validated journal object
 */
export function journalFromString(journalData: string): JournalSchema1 {
  if (typeof journalData !== "string")
    throw Error("Can't read a journal. Is it in SavNote format?");
  if (
    typeof JSON.parse(journalData) !== "object" ||
    JSON.parse(journalData) === null
  )
    throw Error("Can't read a journal. Is it in SavNote format?");
  return validateJournal(JSON.parse(journalData) as object);
}
