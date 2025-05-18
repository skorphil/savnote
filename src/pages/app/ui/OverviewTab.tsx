import { Navbar, Link } from "konsta/react";
import { SummaryCard } from "./summary-card/SummaryCard";
import { MdExitToApp } from "react-icons/md";
import { Preferences } from "@/entities/user-config";

const preferences = new Preferences();

/**
 * Overview tab contain collection of widgets for
 * getting summary overview of journal data
 */
function OverviewTab() {
  const counterCurrency = preferences.usePreferenceValue("selectedCurrency");
  return (
    <>
      <Navbar
        title="Overview"
        right={
          <>
            <span>{counterCurrency || "usd"}</span>
            <Link
              // onClick={() => {
              //   handleJournalExit();
              //   void redirect("/");
              // }}
              navbar
            >
              <MdExitToApp size={24} />
            </Link>
          </>
        }
        colors={{ bgMaterial: "bg-transparent" }}
        className="top-0"
        transparent={false}
      />
      <SummaryCard />
    </>
  );
}

export default OverviewTab;
