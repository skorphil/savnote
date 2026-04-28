export function unixToHumanReadable(unixTime: number) {
  const date = new Date(unixTime);
  const format = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  return format;
}
