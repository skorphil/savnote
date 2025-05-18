/**
 * Removes date from Journal's entity id to make it recordDraft compatible.
 * @param entityId "date.{string}"
 * @returns "{string}"
 */
export function removeDateFromId(entityId: string) {
  // Split the string at most once by the dot
  const parts = entityId.split(".", 1);
  const date = parts[1];

  if (parts.length < 2 || date.length !== 13 || /^\d+$/.test(date))
    throw Error(`${entityId} is not entityId`);

  return parts.slice(1).join(".");
}
