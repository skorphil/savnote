import { invoke } from "@tauri-apps/api/core";

/**
 * Writes string to file on android device.
 * @param uri File uri with write permissions
 * @param contents string to write
 * @returns Saved file uri with persistent(between app reloads, device restarts)
 * read/write permissions
 */
export async function writeFileToAndroid(uri: string, contents: string) {
	try {
		await invoke("write_string", {
			uri,
			contents,
		});
	} catch (e) {
		console.error(e);
		throw Error(
			"Can't write data on device. Please submit an issue to GitHub.",
		);
	}
}
