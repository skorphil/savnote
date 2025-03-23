import { createStore } from "tinybase";

/**
 * Reference to tinyBase store for temporarily storing decrypted records.
 * Stored in memory
 */
export const recordsStore = createStore();

/* ---------- Comments ----------
store created here(not in app) to be accessible for imports to use non-reactive 
methods like .getTable()

it also imported in tinyBase provider for use with hooks in react components
*/
