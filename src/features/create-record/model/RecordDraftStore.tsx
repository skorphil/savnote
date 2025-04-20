import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas";

import * as UiReact from "tinybase/ui-react/with-schemas";
import { type NoValuesSchema, createStore } from "tinybase/with-schemas";
import { tinyBaseRecordDraftSchema } from "./tinyBaseRecordDraftSchema";
import {} from "tinybase/store";

const STORE_ID = "record-draft";
type Schemas = [typeof tinyBaseRecordDraftSchema, NoValuesSchema];

const { useCreateStore, useProvideStore, useCreatePersister, useTable } =
  UiReact as UiReact.WithSchemas<Schemas>;

export const recordDraftStore = createStore().setTablesSchema(
  tinyBaseRecordDraftSchema
);

export const recordDraftPersister = createIndexedDbPersister(
  recordDraftStore,
  STORE_ID
);

/**
 * @returns Table with record's institutions
 */
export const useRecordDraftInstitutions = () => {
  return useTable("institutions");
};

export const RecordDraftStore = () => {
  const store = useCreateStore(() => recordDraftStore);
  useCreatePersister(
    store,
    () => recordDraftPersister,
    [],
    async (persister) => {
      await persister.startAutoLoad();
      await persister.startAutoSave();
    }
  );

  useProvideStore(STORE_ID, store);
  return null;
};
