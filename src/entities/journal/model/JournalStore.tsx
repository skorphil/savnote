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
const {
  useCreateStore,
  useProvideStore,
  useValue,
  useSliceIds,
  useQueries,
  useResultTable,
} = UiReact as UiReact.WithSchemas<Schemas>;

export const journalStore = createStore().setTablesSchema(
  tinyBaseJournalSchema
);

export const journalStoreQueries = createQueries(journalStore);

export const journalStoreIndexes = createIndexes(journalStore);

journalStoreIndexes.setIndexDefinition(
  "InstitutionsByDate",
  "institutions",
  "date",
  "date",
  (id1, id2) => (id1 > id2 ? -1 : 1)
);

/* ---------- CODE BLOCK: Hooks ---------- */

export const useJournalValue = <ValueId extends ValueIds>(valueId: ValueId) =>
  useValue<ValueId>(valueId, STORE_ID);

export const useJournalSliceIds = (indexId: Id) => {
  return useSliceIds(indexId, journalStoreIndexes);
};

export const useJournalQueries = () => {
  return useQueries(STORE_ID);
};

export const useJournalResultTable = (queryId: string) => {
  return useResultTable(queryId, journalStoreQueries);
};

/* ---------- CODE BLOCK: Register in provider ---------- */
export const JournalStore = () => {
  const store = useCreateStore(() => journalStore);
  useProvideStore(STORE_ID, store);
  return null;
};

/* ---------- Comments ----------
18 apr 2024
I can't type id: https://github.com/tinyplex/tinybase/issues/226#issuecomment-2814377488
```
export const useJournalSlices = (indexId: Id) => {
  console.debug("useJournalSlices");
  return useSliceIds(indexId, journalStoreIndexes);
};
```
Probably need to create schema for slices and use keys from it to type ID

===

store created here(not in app) to be accessible for imports to use non-reactive 
methods like .getTable()
it also imported in tinyBase provider for use with hooks in react components
*/
