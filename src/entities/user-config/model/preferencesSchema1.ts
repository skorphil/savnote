import { z } from "zod";

const preferencesSchema1 = z.object({
  currentJournalDirectory: z.string().optional(),
  selectedCurrency: z.string().optional(),
});

type PreferencesSchema1 = z.infer<typeof preferencesSchema1>;

export type { PreferencesSchema1 };
export { preferencesSchema1 };

/* ---------- Comments ---------- 
Schema must respect tinyBase schema structure.
- string | boolean | number
- no nested objects
*/
