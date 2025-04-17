import { Preferences, preferencesPersister } from "@/entities/preferences";
import { redirect } from "react-router";

export async function welcomeLoader() {
  await preferencesPersister.load();
  const { currentJournalDirectory } = new Preferences().getPreferences([
    "currentJournalDirectory",
  ]);
  if (currentJournalDirectory) return redirect("/open");
}
