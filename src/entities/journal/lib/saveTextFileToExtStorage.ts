import { writeTextFile } from "@tauri-apps/plugin-fs";
import { throwError } from "../../../shared/lib/error-handling/throwError";

type SaveToExternalStorageProps = {
  /**
   * Data to be written(overwrite) to target file.
   */
  data: string;
  /**
   * Full directory with file name with Read/Write access
   */
  targetDirectory: string;
};

/**
 * Saves data to provided file in external storage
 */
export async function saveTextFileToExtStorage(
  props: SaveToExternalStorageProps
) {
  const { data, targetDirectory } = props;
  try {
    await writeTextFile(targetDirectory, data);
  } catch (e) {
    throwError(e);
  }
}

/* ---------- References ---------- */
/* 
- writeTextFile not working with google drive directory: "content://com.google.android.apps.docs.storage/document/acc%3D4%3Bdoc%3Dencoded%3Disi6J4XtsaaV4zJVkXblb31gFJxfauMEN9j6gH1AktBeax3mYXaB"
https://discord.com/channels/616186924390023171/1351907743467962428/1351907743467962428
https://github.com/aiueo13/tauri-plugin-android-fs/issues/3

*/
