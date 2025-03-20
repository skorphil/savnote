import { throwError } from "../lib/throwError";
import { Journal } from "../model/journal/Journal";
import { showSaveFileDialog } from "../lib/showSaveFileDialog";
import { showOpenFileDialog } from "../lib/showOpenFileDialog";

export async function handleJournalOpen() {
  try {
    const sourceDir = await showOpenFileDialog();

    // TODO open file dialog with read write permissions https://github.com/aiueo13/tauri-plugin-android-fs/issues/2#issuecomment-2733913797
    const targetDir = await showSaveFileDialog(
      "Savings Journal.sjrn",
      "application/json"
    );
    const journal = await Journal.open({
      sourceDirectory: sourceDir,
      targetDirectory: targetDir || undefined,
    });
    journal.saveToDevice();
    return journal.get();

    // Redirect to `open` Page
  } catch (e) {
    throwError(e);
  }
}
