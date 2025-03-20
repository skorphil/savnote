import { invoke } from "@tauri-apps/api/core";

/**
 * Shows native dialog to choose location to save file.
 * @param defaultName Default name
 * @param mimeType Mime type of saving file
 * @returns Saved file uri with persistent(between app reloads, device restarts)
 * read/write permissions
 */
export async function showSaveFileDialog(
  defaultName: string,
  mimeType: string | null
): Promise<string | null> {
  return await invoke("show_persistent_save_dialog", {
    defaultName,
    mimeType,
  });
}
