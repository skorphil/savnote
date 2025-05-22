import type { RecordsSchema } from "@/shared/journal-schema";
import type {
  RecordDraftAssetSchema,
  RecordDraftInstitutionSchema,
  RecordDraftQuotesSchema,
} from "../model/recordDraftSchema";
import {
  recordDraftRelationships,
  recordDraftStore,
  useRecordDraftLocalRowIds,
  useRecordDraftRow,
  useRecordDraftTable,
} from "../model/RecordDraftStore";
import {
  validateRecordDraftAsset,
  validateRecordDraftInstitution,
} from "../model/validateRecordDraft";
import { Journal, validateRecord } from "@/entities/journal";
import { redirect } from "react-router";

/**
 * Provides various methods to work with a record draft.
 * Initialised with .create() or .load()
 * @example
 * const recordDraft =
 *  RecordDraft.resume() ? RecordDraft.resume() || RecordDraft.new()
 * const assets =
 *  recordDraft.useInstitutionAssets("1655409600000.Bank Of America")
 */
export class RecordDraft {
  static instance: RecordDraft | undefined;
  static store = recordDraftStore;
  previousRecordDate: number | undefined;

  private constructor(
    recordDraftData?: RecordDraftData,
    previousRecordDate?: number
  ) {
    RecordDraft.instance = this;
    if (recordDraftData) RecordDraft.store.setTables(recordDraftData);
    if (previousRecordDate) this.previousRecordDate = previousRecordDate;
  }

  /* ---------- CODE BLOCK: Lifecycle ---------- */
  /**
   * Creates new recordDraft instance from scratch.
   * Removes current instance and its data (if exist)
   * @returns recordDraft instance
   */
  static create(recordDraftData: RecordDraftData, previousRecordDate?: number) {
    this.delete();
    return new RecordDraft(recordDraftData, previousRecordDate);
    // load fromJournal
    // create empty state
  }

  /**
   * Creates new recordDraft instance from persistent state.
   * @returns recordDraft instance
   * @throws Error if recordDraft not saved in persistent store.
   */
  static resume() {
    const isSaved =
      //Checking only meta because might be casse when draft has no institutions (new journal) or no assets
      RecordDraft.store.hasTable("meta");
    if (!isSaved) return null;

    if (
      Journal.resume(() => redirect("/") as never).meta.id !==
      RecordDraft.store.getCell("meta", "0", "journalId")
    )
      return null;
    return this.instance ? this.instance : new RecordDraft();
  }

  static delete() {
    this.store.delTables();
    this.instance = undefined;
  }

  /* ---------- CODE BLOCK: Getters ---------- */
  async getRecordData(): Promise<RecordsSchema> {
    const date = Date.now();
    const quotes = await this.getQuotes(date);
    const { assets, institutions } = RecordDraft.store.getTables();
    if (!assets || !institutions || !quotes)
      // TODO handle attempt to save empty record. Need to propagate to UI state
      throw Error("RecordDraft is empty");

    /* ---------- CODE BLOCK: Extract assets in Journal format ---------- */
    const cleanedAssets: Record<string, object> = {};
    Object.values(assets).forEach((asset) => {
      /* ---------- CODE BLOCK: Ignore deleted institution assets ---------- */
      const institutionDeleted = this.getInstitutionData(
        `${asset.institution}`
      )?.isDeleted;
      const { isDirty, isDeleted, isNew, ...assetData } = asset;
      void [isDirty, isNew];
      if (isDeleted || institutionDeleted) return;
      const { institution, name } = assetData;

      cleanedAssets[`${date}.${institution}.${name}`] = {
        ...assetData,
        date,
      };
    });

    /* ---------- CODE BLOCK: Extract institutions in Journal format ---------- */
    const cleanedInstitutions: Record<string, object> = {};
    Object.values(institutions).forEach((institution) => {
      const { isDirty, isDeleted, isNew, ...institutionData } = institution;
      if (isDeleted) return;
      const { name } = institutionData;
      void [isDirty, isNew];
      cleanedInstitutions[`${date}.${name}`] = { ...institutionData, date };
    });

    const record = validateRecord({
      quotes,
      institutions: cleanedInstitutions,
      assets: cleanedAssets,
    });
    return record;
  }

  /* ---------- CODE BLOCK: Hooks ---------- */
  /**
   * Hook to get assets table, for given institution
   */
  useInstitutionAssets(institutionId: string) {
    return useRecordDraftLocalRowIds("assetsInstitution", institutionId);
  }

  useAssetData(assetId: string) {
    return useRecordDraftRow("assets", assetId);
  }

  useInstitutionData(institutionId: string) {
    return useRecordDraftRow("institutions", institutionId);
  }

  useInstitutions() {
    return useRecordDraftTable("institutions");
  }

  getInstitutionData(institutionId: string) {
    const institutionData = RecordDraft.store.getRow(
      "institutions",
      institutionId
    );
    if (Object.keys(institutionData).length === 0) return undefined;
    return validateRecordDraftInstitution(institutionData);
  }

  getInstitutionAssets(institutionId: string) {
    return recordDraftRelationships.getLocalRowIds(
      "assetsInstitution",
      institutionId
    );
  }

  getInstitutions() {
    const institutions = RecordDraft.store.getRowIds("institutions");
    return institutions.length < 1 ? undefined : institutions;
  }

  getAssetData(assetId: string): RecordDraftAssetSchema | undefined {
    const assetData = RecordDraft.store.getRow("assets", assetId);
    if (Object.keys(assetData).length === 0) return undefined;
    return validateRecordDraftAsset(assetData);
  }

  async getQuotes(
    date: number,
    counterCurrencies = ["usd", "rub", "amd", "brl"]
  ) {
    const baseCurrencies = this.getBaseCurrencies();
    const quotes: RecordDraftQuotesSchema = {};

    const quotesDataPromises = baseCurrencies.map(async (baseCurrency) => {
      const { date: _, ...quoteRates } = await this.fetchQuote(baseCurrency);
      void _;
      counterCurrencies.forEach((counterCurrency) => {
        const rate = quoteRates[baseCurrency][counterCurrency];
        if (typeof rate !== "number")
          throw Error("Fetched rate is not a number");
        quotes[`${date}.${baseCurrency}.${counterCurrency}`] = {
          date,
          baseCurrency,
          counterCurrency,
          rate,
        };
      });
    });

    await Promise.all(quotesDataPromises);
    return quotes;
  }

  /* ---------- CODE BLOCK: Setters ---------- */
  /**
   * Saves asset to recordDraft persistent store
   */
  saveAsset(assetId: string, assetValues: RecordDraftAssetSchema) {
    const validatedAssetValues = validateRecordDraftAsset(assetValues);
    RecordDraft.store.setRow("assets", assetId, validatedAssetValues);
  }

  saveInstitution(
    institutionId: string,
    institutionValues: RecordDraftInstitutionSchema
  ) {
    const validatedInstitutionValues =
      validateRecordDraftInstitution(institutionValues);
    RecordDraft.store.setRow(
      "institutions",
      institutionId,
      validatedInstitutionValues
    );
  }

  /* ---------- CODE BLOCK: Private utilities ---------- */
  private getBaseCurrencies() {
    const assets = RecordDraft.store.getTable("assets");
    const baseCurrencies = new Set<string>();
    Object.values(assets).forEach((asset) => {
      /* ---------- CODE BLOCK: Ignore assets for deleted institutions ---------- */
      const institutionDeleted = this.getInstitutionData(
        `${asset.institution}`
      )?.isDeleted;
      if (asset.currency && !asset.isDeleted && !institutionDeleted)
        baseCurrencies.add(asset.currency);
    });
    return Array.from(baseCurrencies);
  }

  private async fetchQuote(baseCurrency: string, date?: string) {
    // TODO add fallback url https://github.com/fawazahmed0/exchange-api?tab=readme-ov-file#additional-fallback-url-on-cloudflare
    // TODO zod check date format

    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${
      date || "latest"
    }/v1/currencies/${baseCurrency}.json`;
    const response = await fetch(url);
    const quoteData = (await response.json()) as QuoteData;
    return quoteData;
  }
}

type RecordDraftData = {
  institutions: Record<string, RecordDraftInstitutionSchema>;
  assets: Record<string, RecordDraftAssetSchema>;
};

type QuoteData = {
  date: string;
} & Record<string, Record<string, number>>;

/* ---------- CODE BLOCK: Comments ---------- 
1 may 2025
Implemented mvp of quote fetching.
Need to add counter currencies selection mechanism
*/
