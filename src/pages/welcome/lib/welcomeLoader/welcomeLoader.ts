import { Preferences, preferencesPersister } from "@/entities/user-config";
import { redirect } from "react-router";

export async function welcomeLoader() {
	await preferencesPersister.load();
	const { currentJournalDirectory } = Preferences.getInstance().getPreferences([
		"currentJournalDirectory",
	]);
	if (currentJournalDirectory) return redirect("/open");
}
