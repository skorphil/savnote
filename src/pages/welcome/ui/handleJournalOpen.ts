import { throwError } from "../lib/throwError";
import { Journal } from "../model/journal/Journal";
import { showSaveFileDialog } from "../lib/showSaveFileDialog";
import { showOpenFileDialog } from "../lib/showOpenFileDialog";

export async function handleJournalOpen() {
  try {
    const sourceDir = await showOpenFileDialog();

    /* ---------- Workaround ---------- */
    // TODO open file dialog with read write permissions
    // https://github.com/aiueo13/tauri-plugin-android-fs/issues/2#issuecomment-2733913797
    const targetDir = await showSaveFileDialog(
      "SavNote Journal",
      "application/json"
    );
    if (!targetDir) throwError(Error("Target directory not choosen."));
    /* -------------------------------- */

    await Journal.open({
      targetDirectory: targetDir,
      directory: sourceDir,
    });
    // Redirect to `open` Page
  } catch (e) {
    throwError(e);
  }
}

/* ---------- References ---------- 
- tauri-fs currently can't write to google drive. tauri-androight-fs might support this soon:
https://github.com/aiueo13/tauri-plugin-android-fs/issues/3

*/
