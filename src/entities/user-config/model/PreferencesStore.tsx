import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas";
import { tinyBasePreferencesSchema } from "./tinyBasePreferencesSchema";

import type { DependencyList } from "react";
import * as UiReact from "tinybase/ui-react/with-schemas";
import {
	type NoTablesSchema,
	type Value,
	createStore,
} from "tinybase/with-schemas";

const STORE_ID = "preferences";

type Schemas = [NoTablesSchema, typeof tinyBasePreferencesSchema];

const {
	useCreateStore,
	useProvideStore,
	useCreatePersister,
	useValue,
	useSetValueCallback,
} = UiReact as UiReact.WithSchemas<Schemas>;
type ValueIds = keyof typeof tinyBasePreferencesSchema;

export const usePreferenceValue = <ValueId extends ValueIds>(
	valueId: ValueId,
) => useValue<ValueId>(valueId, STORE_ID);

export const useSetSettingsValueCallback = <
	Parameter,
	ValueId extends ValueIds,
>(
	valueId: ValueId,
	getValue: (parameter: Parameter) => Value<Schemas[1], ValueId>,
	getValueDeps?: DependencyList,
) => useSetValueCallback(valueId, getValue, getValueDeps, STORE_ID);

export const preferencesStore = createStore().setValuesSchema(
	tinyBasePreferencesSchema,
);

export const preferencesPersister = createIndexedDbPersister(
	preferencesStore,
	STORE_ID,
);

export const PreferencesStore = () => {
	const store = useCreateStore(() => preferencesStore);
	useCreatePersister(
		store,
		() => preferencesPersister,
		[],
		async (persister) => {
			await persister.startAutoLoad();
			await persister.startAutoSave();
		},
	);

	useProvideStore(STORE_ID, store);
	return null;
};
