import { askFileLocation } from "../lib/askFileLocation";
import { throwError } from "../lib/throwError";
import { Journal } from "../model/journal/Journal";

// Open a dialog
export async function handleJournalOpen() {
  try {
    const dir = await askFileLocation();
    console.debug("dir:", dir);
    const journal = await Journal.open(dir);
    return journal?.get();
    // TODO setLocation to pouchDb
    // Redirect to `open` Page
  } catch (e) {
    throwError(e);
  }
}
