import { Journal } from "@/entities/journal";
import { Preferences } from "@/entities/user-config";
import { RecordDraft } from "@/features/create-record";

export function handleJournalExit() {
	Journal.delete();
	RecordDraft.delete();
	Preferences.getInstance().deleteValue("currentJournalDirectory");
}
