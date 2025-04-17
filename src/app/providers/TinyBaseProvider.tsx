import { Provider } from "tinybase/ui-react";

// import { recordsStore } from "@/entities/journal";
// import { persistentStateStore } from "@/entities/persistentState/model/persistentStateStore";
import type { ReactElement } from "react";
import { Inspector } from "tinybase/ui-react-inspector";

import { JournalStore } from "@/entities/journal";
import { PreferencesStore } from "@/entities/preferences";

// const MemoryStoreWithSchemas = UiReact as UiReact.WithSchemas<
//   [typeof tinyBaseJournalSchema, NoValuesSchema]
// >;
// const PersistentStoreWithSchemas = UiReact as UiReact.WithSchemas<
//   [typeof tinyBasePersistentStoreSchema, NoValuesSchema]
// >;

// recordsStore.setTable("institutions", { row: { country: "eu" } });
// persistentStateStore.setTable("appState", { row: { selectedCurrency: "eur" } });

type AppProps = {
  children: ReactElement;
};
export function TinyBaseProvider(props: AppProps) {
  return (
    <Provider>
      <JournalStore />
      <PreferencesStore />
      {props.children}
      <Inspector />
    </Provider>
  );
}
