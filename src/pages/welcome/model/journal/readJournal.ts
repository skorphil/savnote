import { readTextFile } from "@tauri-apps/plugin-fs";
import { throwError } from "../../lib/throwError";

/**
 * Reads text file which expected to be journal.
 * @param path file absolute directory or uri
 * @returns unvalidated string
 */
export async function readJournal(path: string): Promise<string> {
  try {
    const content = await readTextFile(path);
    if (!content) throw Error("Can't open a journal. Is it in SavNote format?");
    return content;
  } catch (e) {
    throwError(e);
  }
}
