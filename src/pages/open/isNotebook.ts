import { journalSchema, type JournalSchema } from "@/shared/journal-schema";

export function isNotebook(data: unknown): data is JournalSchema {
	const result = journalSchema.safeParse(data);

	return result.success;
}
