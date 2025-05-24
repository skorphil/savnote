import { invoke } from "@tauri-apps/api/core";

/**
 * Shows native dialog to choose location to save file.
 * @param mimeType Mime type of file to open
 * @returns Selected file uri with persistent(between app reloads, device restarts)
 * read/write permissions
 */
export async function showOpenFileDialog(
	mimeTypes: string[] | null,
): Promise<string | null> {
	return await invoke("show_persistent_open_dialog", {
		mimeTypes,
	});
}
