import { throwError } from "@/shared/lib/error-handling";
import { invoke } from "@tauri-apps/api/core";

/**
 * Writes string to file on android device.
 * @param uri File uri with write permissions
 * @param contents string to write
 * @returns Saved file uri with persistent(between app reloads, device restarts)
 * read/write permissions
 */
export function writeStringToFile(uri: string, contents: string) {
  invoke("write_string", {
    uri,
    contents,
  }).catch((e) => throwError(e));
}
