import { Button, Page, Link, Navbar, BlockTitle, Block } from "konsta/react";
import { MdArrowBack, MdDone, MdInfoOutline } from "react-icons/md";
import { Outlet, useNavigate, useParams } from "react-router";

import { unixToHumanReadable } from "@/shared/lib/date-time-format";
import { getRecordDraftData, RecordDraft } from "@/features/create-record";

import { InstitutionsGrid } from "./InstitutionsGrid";
import { throwError } from "@/shared/error-handling";
import { Journal } from "@/entities/journal";

/**
 * Checks if recordDraft data exist in persistent storage. Returns existing
 * recordDraft or create new recordDraft from latest record in journal
 * @returns
 */
function getRecordDraft() {
  const existingRecordDraft = RecordDraft.resume();
  if (!existingRecordDraft) {
    const initialData = getRecordDraftData(); // TODO scenario if empty
    const newRecordDraft = RecordDraft.create(
      initialData.recordDraftData,
      initialData.recordDate
    );
    return newRecordDraft;
  }

  return existingRecordDraft;
}

/**
 * Page displaying new record form
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

async function handleRecordSave() {
  const recordDraft = RecordDraft.instance;
  if (!recordDraft) return;
  // TODO handle Quote parsing error. Manual quotes input
  const recordData = await recordDraft.getRecordData();
  const journal = Journal.resume();
  await journal.addRecord(recordData);
  RecordDraft.delete();
}
