import { Navbar, Page, Link, Button } from "konsta/react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { AssetForm } from "../AssetForm";
import type { ValueIds } from "@/features/create-record/model/RecordDraftStore";

/**
 * New component
 *
 */
function AssetEdit() {
  const { assetId } = useParams();
  const navigate = useNavigate();

  if (!assetId) return;
  return (
    <Page>
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

      <AssetForm assetId={assetId as ValueIds<"assets">} />
    </Page>
  );
}

export default AssetEdit;
