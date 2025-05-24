import { useJournalRecordDates } from "@/entities/journal";
import { Preferences } from "@/entities/user-config";
import { handleJournalExit } from "@/shared/handle-journal-exit";
import { Link, Navbar } from "konsta/react";
import { MdArrowDropDown, MdExitToApp } from "react-icons/md";
import { useNavigate } from "react-router";
import { SummaryCard } from "./summary-card/SummaryCard";

const preferences = Preferences.getInstance();

/**
 * Overview tab contain collection of widgets for
 * getting summary overview of journal data
 */
function OverviewTab() {
	const navigate = useNavigate();
	const counterCurrency = preferences.usePreferenceValue("selectedCurrency");
	const recordDates = useJournalRecordDates();

	let content = <SummaryCard />;
	if (!recordDates || recordDates.length === 0) {
		content = (
			<div className="flex flex-col justify-start items-center h-full">
				<img
					className="w-[50%] mt-28 mb-4 mx-auto opacity-100"
					src="emptySafe.png"
					alt="Illustration with a person standing next to an empty safe"
				/>
				<span className="text-lg mx-4 mb-1 text-center">
					No savings recorded yet
				</span>
				<span className="text-sm opacity-70">
					Add entries to get an overview of your wealth.
				</span>
			</div>
		);
	}
	return (
		<>
			<Navbar
				title="Overview"
				right={
					<>
						<div className="flex flex-row items-center">
							<span>{counterCurrency || "USD"}</span>
							<MdArrowDropDown />
						</div>
						<Link
							onClick={() => {
								handleJournalExit();
								void navigate("/");
							}}
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

			{content}
		</>
	);
}

export default OverviewTab;
