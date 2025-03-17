/**
 * Unified error catching and throwing function
 * @param e unknown error format
 * @throws Error, depending on type of e
 */
export function throwError(e: unknown): never {
  if (typeof e === "string") throw Error(e);
  if (e instanceof Error) throw e;
  throw Error("Unknown error. Please submit bug in our GitHub");
}
