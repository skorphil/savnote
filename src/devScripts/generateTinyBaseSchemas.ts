import {
  assetSchema,
  institutionSchema,
  quoteSchema,
} from "@/shared/journal-schema";

import { preferencesSchema1 } from "@/entities/user-config";
import { zObjectToTinyTable } from "@/shared/lib/zod-to-tiny-base";
import type { TablesSchema } from "tinybase/with-schemas";
import * as fs from "fs";
import * as path from "path";
import type { ValuesSchema } from "tinybase/with-schemas";
import {
  recordDraftAssetSchema,
  recordDraftInstitutionSchema,
  recordDraftQuoteSchema,
} from "@/features/create-record/model/recordDraftSchema";

generateUserConfigSchema();
generateRecordsSchema();
generateRecordDraftSchema();

function generateUserConfigSchema() {
  const preferences: ValuesSchema = zObjectToTinyTable(preferencesSchema1);
  appendConstToFile(
    "src/entities/user-config/model/tinyBasePreferencesSchema.ts",
    "tinyBasePreferencesSchema",
    preferences
  );
}

function generateRecordDraftSchema() {
  const records: TablesSchema = {
    institutions: zObjectToTinyTable(recordDraftInstitutionSchema),
    assets: zObjectToTinyTable(recordDraftAssetSchema),
    quotes: zObjectToTinyTable(recordDraftQuoteSchema),
  };

  appendConstToFile(
    "src/features/create-record/model/tinyBaseRecordDraftSchema.ts",
    "tinyBaseRecordDraftSchema",
    records
  );
}

function generateRecordsSchema() {
  const records: TablesSchema = {
    institutions: zObjectToTinyTable(institutionSchema),
    assets: zObjectToTinyTable(assetSchema),
    quotes: zObjectToTinyTable(quoteSchema),
  };

  appendConstToFile(
    "src/entities/journal/model/tinyBaseJournalSchema.ts",
    "tinyBaseJournalSchema",
    records
  );
}

function appendConstToFile(
  directory: string,
  constName: string,
  tablesObject: TablesSchema | ValuesSchema
) {
  const filePath = path.resolve(directory);
  const content = fs.readFileSync(filePath, "utf8");
  const regex = new RegExp(
    `export const ${constName}\\s*=\\s*(\\{[\\s\\S]*?\\})\\s*as const;`,
    "m"
  );

  const match = content.match(regex);

  if (match) {
    const updatedObject = { ...tablesObject };

    const updatedContent = content.replace(
      match[0],
      `export const ${constName} = ${JSON.stringify(
        updatedObject,
        null,
        2
      )} as const;`
    );

    fs.writeFileSync(filePath, updatedContent, "utf8");
    console.log(`Updated ${constName} successfully!`);
  } else {
    console.error(`Could not find ${constName} in the file.'`);
  }
}
