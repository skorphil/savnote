import { z } from "zod";

/* ---------- Description ---------- 
Flattened schema to support tinyBase and probably SQLite in the future
*/

const instiutionSchema2 = z.object({
  date: z.number().int(),
  name: z.string().refine((value) => !value.includes("."), {
    message: "Institution name must not contain a dot (.)",
  }),
  country: z.string(),
});

const assetSchema2 = z.object({
  date: z.number().int(),
  institution: z.string().refine((value) => !value.includes("."), {
    message: "Institution name must not contain a dot (.)",
  }),
  name: z.string().refine((value) => !value.includes("."), {
    message: "Asset name must not contain a dot (.)",
  }),
  amount: z.number(),
  currency: z.string(),
  isEarning: z.boolean(),
  description: z.string(),
});

const quoteSchema2 = z.object({
  date: z.number().int(),
  baseCurrency: z.string().refine((value) => !value.includes("."), {
    message: "Base currency must not contain a dot (.)",
  }),
  counterCurrency: z.string().refine((value) => !value.includes("."), {
    message: "Counter currency must not contain a dot (.)",
  }),
  rate: z.number(),
});

const quotesSchema2 = z.record(quoteSchema2).refine(
  (data) => {
    const uniqueKeys = new Set<string>();
    for (const key in data) {
      uniqueKeys.add(key);
      const parts = key.split(".");
      if (parts.length !== 3) {
        return false;
      }
      const [date, baseCurrency, counterCurrency] = parts;
      if (!date || !baseCurrency || !counterCurrency) {
        return false;
      }
      if (
        data[key].date.toString() !== date ||
        data[key].baseCurrency !== baseCurrency ||
        data[key].counterCurrency !== counterCurrency
      ) {
        return false;
      }
    }
    if (uniqueKeys.size !== Object.keys(data).length) return false;
    return true;
  },
  {
    message:
      "Quote key must be unique and follow `date.baseCurrency.counterCurrency` pattern",
  }
);

const recordsSchema2 = z.object({
  institutions: z.record(instiutionSchema2).refine(
    (data) => {
      const uniqueKeys = new Set<string>();
      for (const key in data) {
        uniqueKeys.add(key);
        const parts = key.split(".");
        if (parts.length !== 2) {
          return false;
        }
        const [date, institutionName] = parts;
        if (!date || !institutionName) {
          return false;
        }
        if (
          data[key].date.toString() !== date ||
          data[key].name !== institutionName
        ) {
          return false;
        }
      }
      if (uniqueKeys.size !== Object.keys(data).length) return false;
      return true;
    },
    {
      message:
        "Institution key must be unique and follow `date.institutionName` pattern",
    }
  ),
  assets: z.record(assetSchema2).refine(
    (data) => {
      const uniqueKeys = new Set<string>();
      for (const key in data) {
        uniqueKeys.add(key);
        const parts = key.split(".");
        if (parts.length !== 3) {
          return false;
        }
        const [date, institutionName, assetName] = parts;
        if (!date || !institutionName || !assetName) {
          return false;
        }
        if (
          data[key].date.toString() !== date ||
          data[key].institution !== institutionName ||
          data[key].name !== assetName
        ) {
          return false;
        }
      }
      if (uniqueKeys.size !== Object.keys(data).length) return false;
      return true;
    },
    {
      message:
        "Asset key must be unique and follow `date.institutionName.assetName` pattern",
    }
  ),
  quotes: quotesSchema2,
});

const encryptionSchema2 = z.object({
  derivedKeyAlgorithmName: z.literal("AES-GCM"),
  derivedKeyAlgorithmLength: z.literal(256),
  derivationAlgorithmName: z.literal("PBKDF2"),
  derivationAlgorithmHash: z.literal("SHA-256"),
  iterations: z.number(),
  salt: z.string(),
  iv: z.string(),
  cipher: z.string().optional(),
  dataFormat: z.literal("base64"),
});

const metaSchema2 = z.object({
  appName: z.literal("savnote"),
  version: z.literal(2),
  name: z.string(),
});

const journalSchema2 = z.object({
  meta: metaSchema2,
  records: recordsSchema2.optional(),
  encryption: encryptionSchema2.optional(),
});

type JournalSchema2 = z.infer<typeof journalSchema2>;
type RecordsSchema2 = z.infer<typeof recordsSchema2>;
type MetaSchema2 = z.infer<typeof metaSchema2>;
type EncryptionSchema2 = z.infer<typeof encryptionSchema2>;
type QuotesSchema2 = z.infer<typeof quotesSchema2>;

export type {
  JournalSchema2,
  RecordsSchema2,
  MetaSchema2,
  EncryptionSchema2,
  QuotesSchema2,
};
export {
  quotesSchema2,
  recordsSchema2,
  assetSchema2,
  instiutionSchema2,
  quoteSchema2,
  journalSchema2,
  encryptionSchema2,
  metaSchema2,
};

/* ---------- Comment ---------- 
Schema must respect tinyBase schema structure to be automatically converted
to tinyBase Schema
- string | boolean | number
- no nested objects

https://tinybase.org/api/store/type-aliases/store/cell/
https://github.com/tinyplex/tinybase/issues/70

*/
