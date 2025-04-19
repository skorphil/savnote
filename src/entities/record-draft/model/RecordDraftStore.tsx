import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas";

import * as UiReact from "tinybase/ui-react/with-schemas";
import { type NoValuesSchema, createStore } from "tinybase/with-schemas";
import { tinyBaseRecordDraftSchema } from "./tinyBaseRecordDraftSchema";
import {} from "tinybase/store";

const STORE_ID = "record-draft";
type Schemas = [typeof tinyBaseRecordDraftSchema, NoValuesSchema];

const { useCreateStore, useProvideStore, useCreatePersister } =
  UiReact as UiReact.WithSchemas<Schemas>;

export const recordDraftStore = createStore().setTablesSchema(
  tinyBaseRecordDraftSchema
);

export const preferencesPersister = createIndexedDbPersister(
  recordDraftStore,
  STORE_ID
);

export const RecordDraftStore = () => {
  const store = useCreateStore(() => recordDraftStore);
  useCreatePersister(
    store,
    () => preferencesPersister,
    [],
    async (persister) => {
      await persister.startAutoLoad();
      await persister.startAutoSave();
    }
  );

  useProvideStore(STORE_ID, store);
  return null;
};
