export function unixToHumanReadable(unixTime: number) {
	const date = new Date(unixTime);
	const format = date.toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
	});
	return format;
}
