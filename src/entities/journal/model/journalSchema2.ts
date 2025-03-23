import { z } from "zod";

/* ---------- Description ---------- 
Flattened schema to support tinyBase and probably SQLite in the future
*/

const instiutionSchema2 = z.object({
  date: z.string(),
  name: z.string(),
  country: z.string(),
});

const assetSchema2 = z.object({
  date: z.string(),
  institution: z.string(),
  name: z.string(),
  amount: z.number(),
  currency: z.string(),
  isEarning: z.boolean(),
  description: z.string(),
});

const quoteSchema2 = z
  .object({
    date: z.string(),
    baseCurrency: z.string(),
  })
  .catchall(z.number());

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
        if (data[key].date !== date || data[key].name !== institutionName) {
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
          data[key].date !== date ||
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
  quotes: z.record(quoteSchema2).refine(
    (data) => {
      const uniqueKeys = new Set<string>();
      for (const key in data) {
        uniqueKeys.add(key);
        const parts = key.split(".");
        if (parts.length !== 2) {
          return false;
        }
        const [date, baseCurrency] = parts;
        if (!date || !baseCurrency) {
          return false;
        }
        if (
          data[key].date !== date ||
          data[key].baseCurrency !== baseCurrency
        ) {
          return false;
        }
      }
      if (uniqueKeys.size !== Object.keys(data).length) return false;
      return true;
    },
    {
      message:
        "Quote key must be unique and follow `date.baseCurrency` pattern",
    }
  ),
});

const encryptionSchema2 = z.object({
  derivedKeyAlgorithmName: z.literal("AES-GCM"),
  derivedKeyAlgorithmLength: z.literal(256),
  derivationAlgorithmName: z.literal("PBKDF2"),
  derivationAlgorithmHash: z.literal("SHA-256"),
  iterations: z.number(),
  salt: z.string(),
  iv: z.string(),
});

const metaSchema2 = z.object({
  appName: z.literal("savnote"),
  version: z.literal(1),
  name: z.string(),
  dataFormat: z.literal("base64"),
});

const journalSchema2 = z.object({
  meta: metaSchema2,
  encryption: z.union([encryptionSchema2, z.literal(0)]),
  records: z.union([recordsSchema2, z.string(), z.literal(0)]),
});

type JournalSchema2 = z.infer<typeof journalSchema2>;
type RecordSchema2 = z.infer<typeof recordsSchema2>;
type MetaSchema2 = z.infer<typeof metaSchema2>;
type EncryptionSchema2 = z.infer<typeof encryptionSchema2>;

export type { JournalSchema2, RecordSchema2, MetaSchema2, EncryptionSchema2 };
export {
  recordsSchema2,
  assetSchema2,
  instiutionSchema2,
  quoteSchema2,
  journalSchema2,
  encryptionSchema2,
  metaSchema2,
};

/* ---------- Comment ---------- 

- All null values replaced with `0` because tinyBase only support string | number | boolean as of v:^4
https://tinybase.org/api/store/type-aliases/store/cell/
https://github.com/tinyplex/tinybase/issues/70

*/
