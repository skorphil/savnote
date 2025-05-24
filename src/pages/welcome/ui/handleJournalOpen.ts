import { throwError } from "@/shared/error-handling";
import { showOpenFileDialog, Journal } from "@/entities/journal";
import { Preferences } from "@/entities/user-config";

export async function handleJournalOpen() {
  try {
    const directory = await showOpenFileDialog(["application/json"]);

    if (!directory) return null;

    await Journal.deviceReader(directory);
    return new Preferences().updatePreferences({
      currentJournalDirectory: directory,
    });
  } catch (e) {
    throwError(e);
  }
}

/* ---------- Comments ---------- 
- tauri-fs now supports google drive and other apps

- tauri-fs currently can't write to google drive. tauri-androight-fs might support this soon:
https://github.com/aiueo13/tauri-plugin-android-fs/issues/3. 
*/

// static async open(props: JournalOpenProps) {
//   if (Journal.instance) return Journal.instance;
//   const { directory } = props;
//   const journalData = await readJournal(directory);
//   const journal = new Journal({
//     directory,
//     journalData,
//   });

//   return journal;
// }
