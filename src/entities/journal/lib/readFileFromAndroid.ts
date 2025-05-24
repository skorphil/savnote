import { readTextFile } from "@tauri-apps/plugin-fs";

/**
 * Reads json file which expected to be journal.
 * @param directory file absolute directory or uri (with read and write access)
 * @returns validated journal object
 * @throws error from readTextFile
 * @throws error from validating readed data
 */
export async function readFileFromAndroid(directory: string): Promise<string> {
	let content: string;
	try {
		content = await readTextFile(directory);
		return content;
	} catch (e) {
		console.error(e);
		throw new Error("Can't open a file. Please submit a bug to our GitHub");
	}
}
