import type { JournalSchema } from "@/shared/journal-schema";

export const defaultNewJournalData: JournalSchema = {
  meta: {
    appName: "savnote",
    version: 2,
    name: "My SavNote Journal",
  },
};
