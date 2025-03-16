import { askFileLocation } from "../lib/askFileLocation";

// Open a dialog
export async function handleJournalOpen() {
  try {
    const dir = await askFileLocation();
    // TODO check file
    // TODO setLocation to pouchDb
    // Redirect to `open` Page
  } catch (e) {
    if (typeof e === "string") throw Error(e);
    if (e instanceof Error) throw e;
    throw Error("Unknown error. Please submit bug in our GitHub");
  }
}
