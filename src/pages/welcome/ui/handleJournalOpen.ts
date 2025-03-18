import { invoke } from "@tauri-apps/api/core";
import { throwError } from "../lib/throwError";
// import { Journal } from "../model/journal/Journal";
import PouchDB from "pouchdb-browser";

const db = new PouchDB("appState"); // TypeError: The superclass is not a constructor.

export async function handleJournalOpen() {
  try {
    const dir = await showSaveDialog("journal.json", null);
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

async function showSaveDialog(
  defaultName: string,
  mimeType: string | null /* use null instead undefined */
): Promise<string | null> {
  // "plugin:android-fs|" is not need
  return await invoke("show_persistent_save_dialog", {
    // "app" is not need here, this is auto set by Tauri
    defaultName,
    mimeType,
  });
}
