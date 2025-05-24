import type { ReactElement } from "react";
import { Provider } from "tinybase/ui-react";
import { Inspector } from "tinybase/ui-react-inspector";

/* ---------- CODE BLOCK: tinyBase stores required to add them to <Provider> ---------- */
import { JournalStore } from "@/entities/journal";
import { PreferencesStore } from "@/entities/user-config";
import { RecordDraftStore } from "@/features/create-record";

type AppProps = {
	children: ReactElement;
};
export function TinyBaseProvider(props: AppProps) {
	return (
		<Provider>
			<JournalStore />
			<RecordDraftStore />
			<PreferencesStore />
			{props.children}
			<Inspector />
		</Provider>
	);
}
