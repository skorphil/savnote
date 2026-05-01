import { Block, BlockTitle, Button, Link, Navbar, Page } from "konsta/react";
import { MdArrowBack, MdDone, MdInfoOutline } from "react-icons/md";
import { Outlet, useNavigate, useParams } from "react-router";
import { Journal } from "@/entities/journal";
import { getRecordDraftData, RecordDraft } from "@/features/create-record";
import { throwError } from "@/shared/error-handling";
import { unixToHumanReadable } from "@/shared/lib/date-time-format";
import { InstitutionsGrid } from "./InstitutionsGrid";

/**
 * Checks if recordDraft data exist in persistent storage. Returns existing
 * recordDraft or creates new recordDraft from latest record in journal.
 * @returns Existing or newly created RecordDraft instance
 */
function getRecordDraft() {
	const existingRecordDraft = RecordDraft.resume();
	if (!existingRecordDraft) {
		const initialData = getRecordDraftData(); // TODO scenario if empty
		const newRecordDraft = RecordDraft.create(
			initialData.recordDraftData,
			initialData.recordDate,
		);
		return newRecordDraft;
	}

	return existingRecordDraft;
}

/**
 * Page component for creating a new journal record.
 * Displays institutions from the previous record and allows the user to select
 * an institution and update assets.
 */
export function New() {
	const { institutionId } = useParams();
	const navigate = useNavigate();
	const recordDraft = getRecordDraft();

	const institutions = recordDraft.useInstitutions();
	const date = recordDraft.previousRecordDate;

	if (!institutions) return null;

	return (
		<Page
			className={`${institutionId && "pb-[400px]"} no-scrollbar flex flex-col`}
		>
			<Navbar
				left={
					<Link navbar onClick={() => void navigate(-1)}>
						<MdArrowBack size={24} />
					</Link>
				}
				title="New entry"
				// subtitle="Pre-filled from 31 May 2024"
				right={
					<div className="pr-3">
						<Button
							className="min-w-26 gap-2"
							rounded
							onClick={() => {
								handleRecordSave().catch((e) => throwError(e));
								void navigate("/app");
							}}
						>
							<MdDone size={24} />
							Save
						</Button>
					</div>
				}
				colors={{ bgMaterial: "bg-md-light-surface dark:bg-md-dark-surface" }}
				className="top-0"
				transparent={false}
			/>

			{date ? (
				<BlockTitle withBlock={false}>
					Institutions from {unixToHumanReadable(date)}
				</BlockTitle>
			) : (
				false
			)}

			<InstitutionsGrid institutions={institutions} navigate={navigate} />

			<Block className="opacity-40 gap-2 flex items-center mt-auto">
				<span>
					<MdInfoOutline size={24} />
				</span>
				<span>
					Select institution and update assets to reflect current savings
				</span>
			</Block>

			<Outlet />
		</Page>
	);
}

/**
 * Saves the current record draft to the journal and deletes the draft.
 * @returns Promise that resolves when record is saved
 */
async function handleRecordSave() {
	const recordDraft = RecordDraft.instance;
	if (!recordDraft) return;
	// TODO handle Quote parsing error
	const recordData = await recordDraft.getRecordData();
	Journal.instance?.addRecord(recordData);
	RecordDraft.delete();
}
