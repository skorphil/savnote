import {
  journalStore,
  journalStoreIndexes,
  journalStoreQueries,
} from "@/entities/journal";
import type {
  RecordDraftAssetSchema,
  RecordDraftInstitutionSchema,
} from "../model/recordDraftSchema";
import { RecordDraft } from "./RecordDraft";

export function createRecordDraft() {
  const latestRecordDate =
    journalStoreIndexes.getSliceIds("InstitutionsByDate")[0];

  /* ---------- CODE BLOCK: Get list of institutions for given date ---------- */
  const recordDraftInstitutions: Record<string, RecordDraftInstitutionSchema> =
    {};
  journalStoreQueries.setQueryDefinition(
    "latestRecordInstitutions",
    "institutions",
    ({ select, where }) => {
      select("country");
      select("date");
      select("name");
      where("date", Number(latestRecordDate));
    }
  );

  journalStoreQueries.forEachResultRow("latestRecordInstitutions", (rowId) => {
    const { country, date, name } = journalStore.getRow("institutions", rowId);
    if (country === undefined || date === undefined || name === undefined)
      throw Error("Country, date or name of institution is undefined");
    recordDraftInstitutions[rowId] = { country, date, name, isDirty: false };
  });

  /* ---------- CODE BLOCK: Get list of records for given date ---------- */
  const recordDraftAssets: Record<string, RecordDraftAssetSchema> = {};

  journalStoreQueries.setQueryDefinition(
    "latestRecordAssets",
    "assets",
    ({ select, where }) => {
      select("amount");
      select("currency");
      select("date");
      select("description");
      select("institution");
      select("isEarning");
      select("name");
      where("date", Number(latestRecordDate));
    }
  );

  journalStoreQueries.forEachResultRow("latestRecordAssets", (rowId) => {
    const {
      date,
      name,
      amount,
      currency,
      description,
      institution,
      isEarning,
    } = journalStore.getRow("assets", rowId);
    // TODO simplify check by adding typeguard with z.validate
    if (
      amount === undefined ||
      date === undefined ||
      name === undefined ||
      currency === undefined ||
      description === undefined ||
      institution === undefined ||
      isEarning === undefined
    )
      throw Error("Country, date or name of institution is undefined");
    recordDraftAssets[rowId] = {
      date,
      name,
      amount,
      currency,
      description,
      institution,
      isEarning,
      isDirty: false,
    };
  });

  new RecordDraft(
    { assets: recordDraftAssets, institutions: recordDraftInstitutions },
    Number(latestRecordDate)
  );
}
