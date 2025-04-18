import { readTextFile } from "@tauri-apps/plugin-fs";
import { throwError } from "@/shared/lib/error-handling";
import { journalFromString } from "./journalFromString";
import type { JournalSchema2 } from "../model/journalSchema2";

/**
 * Reads text file which expected to be journal.
 * @param directory file absolute directory or uri
 * @returns validated journal object
 */
export async function readJournal(directory: string): Promise<JournalSchema2> {
  try {
    const content = await readTextFile(directory);
    if (!content) throw Error("Can't open a journal. Is it in SavNote format?");
    return journalFromString(content);
  } catch (e) {
    throwError(e);
  }
}
