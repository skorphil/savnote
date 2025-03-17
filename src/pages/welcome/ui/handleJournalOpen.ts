import { askFileLocation } from "../lib/askFileLocation";
import { throwError } from "../lib/throwError";
// import { Journal } from "../model/journal/Journal";
import PouchDB from "pouchdb-browser";

const db = new PouchDB("appState"); // TypeError: The superclass is not a constructor.

export async function handleJournalOpen() {
  try {
    const dir = await askFileLocation();
    console.debug("dir:", dir);
    // const journal = await Journal.open(dir);

    await db.put({
      _id: "appDataDir",
      journalDir: dir,
    });

    // TODO setLocation to pouchDb
    // Redirect to `open` Page
  } catch (e) {
    throwError(e);
  }
}
