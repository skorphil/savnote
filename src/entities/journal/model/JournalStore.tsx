import { tinyBaseJournalSchema } from "./tinyBaseJournalSchema";

import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  type Id,
  type NoValuesSchema,
  createIndexes,
  createQueries,
  createStore,
} from "tinybase/with-schemas";

const STORE_ID = "journal";
type ValueIds = keyof typeof tinyBaseJournalSchema;
type Schemas = [typeof tinyBaseJournalSchema, NoValuesSchema];
const { useCreateStore, useProvideStore, useValue, useSliceIds } =
  UiReact as UiReact.WithSchemas<Schemas>;

export const journalStore = createStore().setTablesSchema(
  tinyBaseJournalSchema
);

export const journalStoreQueries = createQueries(journalStore);

journalStoreQueries.setQueryDefinition(
  "recordDates",
  "institutions",
  ({ select }) => {
    select("date");
  }
);

export const journalStoreIndexes = createIndexes(journalStore);

journalStoreIndexes.setIndexDefinition(
  "InstitutionsByDate",
  "institutions",
  "date"
);

export const useJournalValue = <ValueId extends ValueIds>(valueId: ValueId) =>
  useValue<ValueId>(valueId, STORE_ID);

export const JournalStore = () => {
  const store = useCreateStore(() => journalStore);
  // useCreatePersister(
  //   settingsStore,
  //   (settingsStore) => createLocalPersister(settingsStore, STORE_ID),
  //   [],
  //   async (persister) => {
  //     await persister.startAutoLoad();
  //     await persister.startAutoSave();
  //   },
  // );

  useProvideStore(STORE_ID, store);
  return null;
};

export const useJournalSlices = (indexId: Id) => {
  console.debug("useJournalSlices");
  return useSliceIds(indexId, journalStoreIndexes);
};

// ---

/**
 * Reference to tinyBase store for temporarily storing decrypted records.
 * Stored in memory
 */
// export const recordsStore = createStore().setTablesSchema(
//   tinyBaseJournalSchema
// );

/* ---------- Comments ----------
store created here(not in app) to be accessible for imports to use non-reactive 
methods like .getTable()

it also imported in tinyBase provider for use with hooks in react components
*/
