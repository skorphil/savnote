import { RecordDraft } from "@/features/create-record";
import { Badge, List, ListItem } from "konsta/react";
import { Sheet } from "react-modal-sheet";
import { useNavigate, useParams, type NavigateFunction } from "react-router";
import type { ValueIds } from "@/features/create-record";

export function InstitutionSheet() {
  const navigate = useNavigate();
  const { institutionId } = useParams();
  if (!institutionId) return;
  const recordDraftInstance = RecordDraft.instance;
  const institutionAssetsIds =
    recordDraftInstance?.useInstitutionAssets(institutionId);
  const institutionData =
    recordDraftInstance?.getInstitutionData(institutionId);
  let flag: string;
  switch (institutionData?.country) {
    case "ru":
      flag = "🇷🇺";
      break;
    case "am":
      flag = "🇦🇲";
      break;
    default:
      flag = "🌍";
  }

  return (
    <Sheet
      dragVelocityThreshold={100}
      isOpen
      onCloseStart={() => {
        void navigate(-1);
      }}
      onClose={() => {
        void navigate(-1);
      }}
      // BUG naviagtion history updates with a freeze: this causing: card not
      // navigating when clicked shotly after sheet being closed. Maybe due to sheet animation?
      // It is not respond to click. Disabling animation not working
      // await navigate here not working
      // removing { replace: true } seems not working

      snapPoints={[360]}
      initialSnap={0}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content disableDrag className=" h-[80px] hairline-b">
          <List className="my-0">
            {institutionId && (
              <ListItem
                link
                strongTitle
                media={flag}
                title={institutionData?.name}
                footer={`${institutionAssetsIds?.length} assets`}
              />
            )}
          </List>
        </Sheet.Content>
        <Sheet.Scroller>
          <List className="mt-4 mb-14">
            {institutionAssetsIds &&
              institutionAssetsIds.map((assetId) => (
                <AssetListItem
                  key={assetId}
                  navigate={navigate}
                  assetId={assetId as ValueIds<"assets">}
                /> // TODO Improve typings
              ))}
          </List>
        </Sheet.Scroller>
        <Sheet.Content>
          <div className={`left-0 bottom-0 h-24`}>
            // TODO institution toolbar
          </div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

function AssetListItem({
  assetId,
  navigate,
}: {
  assetId: ValueIds<"assets">;
  navigate: NavigateFunction;
}) {
  const recordDraft = RecordDraft.instance;
  if (!recordDraft) return;

  const { name, amount, currency, description, isDirty } =
    recordDraft.useInstitutionAsset(assetId);
  return (
    <ListItem
      link
      media={"💰"} // <MdDiamond color="var(--blue-100)" size={24} />
      strongTitle={false}
      header={name}
      after={isDirty && <Badge colors={{ bg: "bg-green-800" }}>upd</Badge>}
      footer={description}
      title={`${amount} ${currency}`}
      onClick={() => void navigate(`assets/${assetId}/edit`)}
    />
  );
}
