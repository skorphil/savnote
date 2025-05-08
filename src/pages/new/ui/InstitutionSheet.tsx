import { RecordDraft } from "@/features/create-record";
import { Badge, Fab, List, ListItem, Link } from "konsta/react";
import { Sheet } from "react-modal-sheet";
import { useNavigate, useParams, type NavigateFunction } from "react-router";
import type { ValueIds } from "@/features/create-record";
import { type ReactElement, useState } from "react";
import { BottomAppBar } from "./BottomAppBar";
import { MdAdd, MdDeleteOutline } from "react-icons/md";

export function InstitutionSheet() {
  const navigate = useNavigate();
  const { institutionId } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  if (!institutionId) return;
  const recordDraftInstance = RecordDraft.instance;
  const institutionAssetsIds =
    recordDraftInstance?.useInstitutionAssets(institutionId);
  const institutionData =
    recordDraftInstance?.getInstitutionData(institutionId);
  // let flag: string;
  // switch (institutionData?.country) {
  //   case "ru":
  //     flag = "🇷🇺";
  //     break;
  //   case "am":
  //     flag = "🇦🇲";
  //     break;
  //   default:
  //     flag = "🌍";
  // }

  return (
    <Sheet
      dragVelocityThreshold={50}
      isOpen={isOpen}
      // onCloseStart={() => {
      //   void navigate(-1);
      // }}
      onClose={() => {
        setIsOpen(false);
        void navigate("/newrecord", { replace: true });
        // setTimeout(() => void navigate("/newrecord"), 0);
      }}
      // BUG naviagtion history updates with a freeze: this causing: card not
      // navigating when clicked shotly after sheet being closed. Maybe due to sheet animation?
      // It is not respond to click. Disabling animation not working
      // await navigate here not working
      // removing { replace: true } seems not working

      snapPoints={[400]}
      initialSnap={0}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content disableDrag>
          <ul className="my-0 hairline-b relative">
            {institutionId && (
              <ListItem
                className="my-0 hairline-b"
                link
                strongTitle
                // media={flag}
                title={`${institutionData?.name}`}
                text={`${institutionAssetsIds?.length} assets`}
              />
            )}
          </ul>
          <BottomAppBar
            leftButtons={[
              <Link navbar>
                <MdDeleteOutline size={24} />
              </Link>,
            ]}
            bg="bg-[#313131]"
            fab={
              <Fab
                icon={<MdAdd />}
                text="New asset"
                onClick={() => {
                  void navigate("assets/create", { viewTransition: true });
                }}
                colors={{
                  bgMaterial:
                    "bg-md-light-secondary-container dark:bg-md-dark-secondary-container",
                }}
                textPosition="after"
              />
            }
          />
          <Sheet.Scroller className="pb-[40px]">
            <List className="mt-4 mb-14">
              {institutionAssetsIds &&
                institutionAssetsIds.map((assetId) => {
                  const recordDraft = RecordDraft.resume();
                  if (!recordDraft) return;
                  const { isDeleted } = recordDraft.getAssetData(assetId);
                  if (isDeleted) return;
                  return (
                    <AssetListItem
                      key={assetId}
                      navigate={navigate}
                      assetId={assetId as ValueIds<"assets">}
                    /> // TODO Improve typings
                  );
                })}
              {institutionAssetsIds &&
                institutionAssetsIds.map((assetId) => {
                  const recordDraft = RecordDraft.resume();
                  if (!recordDraft) return;
                  const { isDeleted } = recordDraft.getAssetData(assetId);
                  if (!isDeleted) return;
                  return (
                    <AssetListItem
                      key={assetId}
                      navigate={navigate}
                      assetId={assetId as ValueIds<"assets">}
                    /> // TODO Improve typings
                  );
                })}
            </List>
          </Sheet.Scroller>
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

  const { name, amount, currency, description, isDirty, isDeleted, isNew } =
    recordDraft.useInstitutionAsset(assetId);

  let badge: ReactElement | undefined;

  if (isNew) badge = <Badge colors={{ bg: "bg-neutral-600" }}>new</Badge>;
  if (isDirty && !isNew)
    badge = <Badge colors={{ bg: "bg-neutral-600" }}>updated</Badge>;

  return (
    <ListItem
      colors={
        isDeleted
          ? {
              primaryTextMaterial: "text-neutral-500 line-through",
              secondaryTextMaterial: "text-neutral-500 line-through",
            }
          : {}
      }
      link
      // media={<MdMoney className="opacity-70" size={24} />}
      strongTitle={false}
      header={name}
      after={badge}
      footer={description}
      title={`${amount} ${currency}`}
      onClick={() =>
        void navigate(`assets/${assetId}/edit`, { viewTransition: true })
      }
    />
  );
}
