import { readTextFile } from "@tauri-apps/plugin-fs";
import { throwError } from "../../lib/throwError";

/**
 * Reads text file which expected to be journal.
 * @param directory file absolute directory or uri
 * @returns unvalidated string
 */
export async function readJournal(directory: string): Promise<string> {
  try {
    const content = await readTextFile(directory);
    if (!content) throw Error("Can't open a journal. Is it in SavNote format?");
    return content;
  } catch (e) {
    throwError(e);
  }
}
