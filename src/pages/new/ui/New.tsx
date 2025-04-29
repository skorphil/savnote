import { Button, Page, Link, Navbar, BlockTitle, Block } from "konsta/react";
import { MdArrowBack, MdInfoOutline } from "react-icons/md";
import { Outlet, useNavigate, useParams } from "react-router";
import { recordDraftStore } from "@/features/create-record/model/RecordDraftStore";

import * as UiReact from "tinybase/ui-react/with-schemas";

import type { tinyBaseRecordDraftSchema } from "@/features/create-record/model/tinyBaseRecordDraftSchema";
import type { NoValuesSchema } from "tinybase/with-schemas";
import { unixToHumanReadable } from "@/shared/lib/date-time-format";
import { RecordDraft } from "@/features/create-record";

import { InstitutionsGrid } from "./InstitutionsGrid";
type Schemas = [typeof tinyBaseRecordDraftSchema, NoValuesSchema];

const { useTable } = UiReact as UiReact.WithSchemas<Schemas>; // TODO replace with method from

/**
 * Page displaying new record form
 */
function New() {
  const { institutionId } = useParams();
  const institutions = useTable("institutions", recordDraftStore);
  const navigate = useNavigate();
  const date = RecordDraft.instance?.previousRecordDate;

  return (
    <Page
      className={`${institutionId && "pb-[240px]"} no-scrollbar flex flex-col`}
    >
      <Navbar
        left={
          <Link navbar onClick={() => void navigate(-1)}>
            {/* 
              navigate -1 somehow navigate to /new, not before. 
              When sheet is closed by drag.
              Needed to navigate -1 on sheet close instead of to /app to make it work 
            */}
            <MdArrowBack size={24} />
          </Link>
        }
        title="New record"
        subtitle="Draft saved"
        right={
          <div className="pr-3">
            <Button className="min-w-32" rounded>
              Save
            </Button>
          </div>
        }
        colors={{ bgMaterial: "bg-transparent" }}
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

      <InstitutionsGrid
        institutions={institutions}
        navigate={navigate}
        isInstitutionSelected={institutionId ? true : false}
      />

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

export { New };
