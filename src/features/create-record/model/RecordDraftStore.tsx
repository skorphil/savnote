import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas";
import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  type GetCell,
  type NoValuesSchema,
  createQueries,
  createRelationships,
  createStore,
} from "tinybase/with-schemas";
import { tinyBaseRecordDraftSchema } from "./tinyBaseRecordDraftSchema";

const STORE_ID = "record-draft";

const {
  useCreateStore,
  useProvideStore,
  useCreatePersister,
  useTable,
  useLocalRowIds,
  useRow,
} = UiReact as UiReact.WithSchemas<Schemas>;

/**
 * TinyBase Record Draft Store object.
 * Direct use is allowed only in RecordDraft class.
 */
export const recordDraftStore = createStore().setTablesSchema(
  tinyBaseRecordDraftSchema
);

export const recordDraftPersister = createIndexedDbPersister(
  recordDraftStore,
  STORE_ID
);

/* ---------- CODE BLOCK: Queries definition ---------- */
export const recordDraftQueries = createQueries(recordDraftStore);

/* ---------- CODE BLOCK: Relationships definition ---------- 
Extra typings and iteration technique is used to properly type
relationship hooks.
TinyBase does not natively provide the list of relationship ids, so it needed
to be created manually.
*/
const assetsInstitutionRelationship: RelationshipDefinitionArgs<"assets"> = [
  "assetsInstitution",
  "assets",
  "institutions",
  (getCell) => `${getCell("date")}.${getCell("institution")}`, //
];

const recordDraftRelationshipsSchema = {
  assetsInstitution: assetsInstitutionRelationship,
} as const;

export const recordDraftRelationships = createRelationships(recordDraftStore);
Object.values(recordDraftRelationshipsSchema).forEach((relationshipArgs) =>
  recordDraftRelationships.setRelationshipDefinition(...relationshipArgs)
);

/* ---------- CODE BLOCK: Hooks definition ----------
Abstract hooks defined here to avoid extra typings on imports in other 
parts of a project (UiReact as UiReact.WithSchemas<Schemas>). 
tinyBase typings specific.
*/
export const useRecordDraftLocalRowIds = (
  relationshipId: RecordDraftRelationshipIds,
  remoteRowId: string
) => useLocalRowIds(relationshipId, remoteRowId, recordDraftRelationships);

export const useRecordDraftTable = <TableId extends TableIds>(
  tableId: TableId
) => {
  return useTable(tableId, recordDraftStore);
};

export const useRecordDraftRow = <TableId extends TableIds>(
  tableId: TableId,
  assetId: ValueIds<TableId>
) => useRow(tableId, assetId, recordDraftStore);

/* ---------- CODE BLOCK: <RecordDraftStore> definition  ---------- 
Used to asign store to tinyBase Provider.
Specific pattern of TinyBase: https://github.com/tinyplex/tinybase/issues/226
*/
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

type Schemas = [typeof tinyBaseRecordDraftSchema, NoValuesSchema];
export type TableIds = keyof typeof tinyBaseRecordDraftSchema;
export type ValueIds<TableId extends TableIds> =
  keyof (typeof tinyBaseRecordDraftSchema)[TableId] extends string
    ? keyof (typeof tinyBaseRecordDraftSchema)[TableId]
    : never;

type RelationshipDefinitionArgs<TableId extends TableIds> = [
  relationshipId: string,
  localTableId: TableId,
  remoteTableId: TableIds,
  getRemoteRowId:
    | ValueIds<TableId>
    | ((
        getCell: GetCell<typeof tinyBaseRecordDraftSchema, TableId>,
        localRowId: string
      ) => string)
];
type RecordDraftRelationshipIds = keyof typeof recordDraftRelationshipsSchema;

/* ---------- Comments ---------- 
20 apr 2025
I decided to export only abstract hooks from store 
(because they need extra typings on imports)
RecordDraftStore MUST be imported directly only into RecordDraft class.
Interaction with RecordDraftStore allowed only via RecordDraft methods
(Dependency inversion principle).

*/
