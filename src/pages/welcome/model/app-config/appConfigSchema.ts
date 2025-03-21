import { z } from "zod";

const appConfigSchema1 = z.object({
  currentJournalDirectory: z.string().optional(),
});

type AppConfigSchema1 = z.infer<typeof appConfigSchema1>;

export type { AppConfigSchema1 };
export { appConfigSchema1 };
