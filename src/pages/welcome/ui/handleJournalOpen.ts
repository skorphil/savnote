import { throwError } from "@/shared/lib/error-handling";
import { Journal } from "@/entities/journal";
import { showOpenFileDialog } from "@/entities/journal";

export async function handleJournalOpen() {
  try {
    const directory = await showOpenFileDialog(["application/json"]);
    if (!directory) return;

    /* ---------- Workaround ---------- */
    // https://github.com/aiueo13/tauri-plugin-android-fs/issues/2#issuecomment-2733913797
    // const targetDir = await showSaveFileDialog("Journal", "application/json");
    // if (!targetDir) throwError(Error("Target directory not choosen."));
    /* -------------------------------- */

    await Journal.open({
      directory,
    });
  } catch (e) {
    throwError(e);
  }
}

/* ---------- References ---------- 
- tauri-fs currently can't write to google drive. tauri-androight-fs might support this soon:
https://github.com/aiueo13/tauri-plugin-android-fs/issues/3
*/
