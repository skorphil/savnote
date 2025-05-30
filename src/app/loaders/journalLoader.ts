import { JournalManager } from "@/entities/journal";
import { redirect } from "react-router";
/**
 * Checks if Journal instance exist. If not, redirects to `Open` page.
 * If Journal instance not exist, it means journal data was cleaned out of memory:
 * - Because of app stopped
 * - Android optimisation
 */
export function journalLoader() {
	if (!JournalManager.getJournal()) return redirect("/");
}
