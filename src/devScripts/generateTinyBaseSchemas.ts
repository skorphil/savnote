import {
  assetSchema,
  instiutionSchema,
  quoteSchema,
} from "@/shared/journal-schema";

import { preferencesSchema1 } from "@/entities/preferences";
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

generatePersistentStateSchema();
generateRecordsSchema();
generateRecordDraftSchema();

function generatePersistentStateSchema() {
  const preferences: ValuesSchema = zObjectToTinyTable(preferencesSchema1);

  // write appState to ts file
  appendConstToFile(
    "src/entities/preferences/model/tinyBasePreferencesSchema.ts",
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
    institutions: zObjectToTinyTable(instiutionSchema),
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
  // Find the "emptyVar" declaration
  const match = content.match(regex);

  if (match) {
    // Parse the existing object
    // const existingObject = eval(`(${match[1]})`);

    // Merge new data
    const updatedObject = { ...tablesObject };

    // Replace in content
    const updatedContent = content.replace(
      match[0],
      `export const ${constName} = ${JSON.stringify(
        updatedObject,
        null,
        2
      )} as const;`
    );

    // Write back the updated file
    fs.writeFileSync(filePath, updatedContent, "utf8");
    console.log(`Updated ${constName} successfully!`);
  } else {
    console.error(`Could not find ${constName} in the file.'`);
  }
}
