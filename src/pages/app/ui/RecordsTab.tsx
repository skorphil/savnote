import { Link, List, ListItem, Navbar } from "konsta/react";
import { MdExitToApp } from "react-icons/md";
import { redirect, useNavigate } from "react-router";
import { Journal } from "@/entities/journal";
import { handleJournalExit } from "@/shared/handle-journal-exit";
import { unixToHumanReadable } from "@/shared/lib/date-time-format";

/**
 * Records tab displaying journal entries grouped by date.
 */
function RecordsTab() {
	const navigate = useNavigate();
	const journal = Journal.resume(() => redirect("/") as never);
	const recordDates = journal.useJournalSliceIds("InstitutionsByDate");

	return (
		<>
			<Navbar
				title="Records"
				right={
					<Link
						onClick={() => {
							handleJournalExit();
							void navigate("/");
						}}
					>
						<MdExitToApp size={24} />
					</Link>
				}
				colors={{ bgMaterial: "bg-transparent" }}
				className="top-0"
				transparent={false}
			/>
			<List inset className="space-y-4 mb-28 mt-0">
				{recordDates?.map((date) => (
					<ListItem key={date}>
						<span>{unixToHumanReadable(Number(date))}</span>
					</ListItem>
				))}
			</List>
		</>
	);
}

export { RecordsTab };
