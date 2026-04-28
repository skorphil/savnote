import { RecordDraft } from "@/features/create-record";
import { Badge, Fab, List, ListItem, Link } from "konsta/react";
import { Sheet } from "react-modal-sheet";
import { useNavigate, useParams, type NavigateFunction } from "react-router";
import type {
  RecordDraftInstitutionSchema,
  ValueIds,
} from "@/features/create-record";
import { type ReactElement, useState } from "react";
import { BottomAppBar } from "./BottomAppBar";
import {
  MdAdd,
  MdDeleteOutline,
  MdInfoOutline,
  MdRestore,
} from "react-icons/md";
import { validateRecordDraftInstitution } from "@/features/create-record/model/validateRecordDraft";

export function InstitutionSheet() {
  const navigate = useNavigate();
  const { institutionId } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  if (!institutionId) return null;
  const recordDraftInstance = RecordDraft.instance;
  if (!recordDraftInstance)
    return navigate("/newrecord", { replace: true }) as never;
  const institutionAssetsIds =
    recordDraftInstance.useInstitutionAssets(institutionId);
  let institutionData: RecordDraftInstitutionSchema;
  try {
    const data = recordDraftInstance.useInstitutionData(institutionId);
    institutionData = validateRecordDraftInstitution(data);
  } catch (e) {
    void e;
    return navigate("/newrecord", { replace: true }) as never;
  }

  const bottomLeftButtons = institutionData.isDeleted
    ? [
        <Link
          onClick={() => {
            const updatedState = {
              ...institutionData,
              isDeleted: false,
            };
            void handleInstitutionSave(updatedState, institutionId);
          }}
          navbar
        >
          <MdRestore size={24} />
        </Link>,
      ]
    : [
        <Link
          onClick={() => {
            setIsOpen(false);
            void navigate("/newrecord", { replace: true });

            const updatedState = {
              ...institutionData,
              isDeleted: true,
            };
            void handleInstitutionSave(updatedState, institutionId);
          }}
          navbar
        >
          <MdDeleteOutline size={24} />
        </Link>,
      ];

  const bottomFab = institutionData.isDeleted ? (
    <div className="opacity-40 text-sm flex flex-row gap-1 items-center">
      <MdInfoOutline size={24} />
      <span>Restore institution to edit it</span>
    </div>
  ) : (
    <Fab
      icon={<MdAdd />}
      text="Add asset"
      onClick={() => {
        void navigate("assets/create", { viewTransition: true });
      }}
      colors={{
        bgMaterial:
          "bg-md-light-secondary-container dark:bg-md-dark-secondary-container",
      }}
      textPosition="after"
    />
  );

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
            leftButtons={bottomLeftButtons}
            bg="bg-[#313131]"
            fab={bottomFab}
          />
          <Sheet.Scroller className="pb-[40px]">
            <List className="mt-4 mb-14">
              {institutionAssetsIds &&
                institutionAssetsIds.map((assetId) => {
                  const recordDraft = RecordDraft.resume();
                  if (!recordDraft) return;
                  const isDeleted =
                    recordDraft.getAssetData(assetId)?.isDeleted;
                  if (isDeleted) return;
                  return (
                    <AssetListItem
                      key={assetId}
                      navigate={navigate}
                      assetId={assetId as ValueIds<"assets">}
                      disabled={institutionData.isDeleted}
                    /> // TODO Improve typings
                  );
                })}
              {institutionAssetsIds &&
                institutionAssetsIds.map((assetId) => {
                  const recordDraft = RecordDraft.resume();
                  if (!recordDraft) return;
                  const isDeleted =
                    recordDraft.getAssetData(assetId)?.isDeleted;
                  if (!isDeleted) return;
                  return (
                    <AssetListItem
                      key={assetId}
                      navigate={navigate}
                      assetId={assetId as ValueIds<"assets">}
                      disabled={institutionData.isDeleted}
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
  disabled, // why its undefined? i passed true
}: {
  assetId: ValueIds<"assets">;
  navigate: NavigateFunction;
  disabled?: boolean;
}) {
  const recordDraft = RecordDraft.instance;
  if (!recordDraft) return null;

  const { name, amount, currency, description, isDirty, isDeleted, isNew } =
    recordDraft.useAssetData(assetId);

  let badge: ReactElement | undefined;

  if (isNew) badge = <Badge colors={{ bg: "bg-neutral-600" }}>new</Badge>;
  if (isDirty && !isNew && !isDeleted)
    badge = <Badge colors={{ bg: "bg-neutral-600" }}>updated</Badge>;

  return (
    <ListItem
      colors={{
        ...(isDeleted
          ? {
              primaryTextMaterial: "text-neutral-500 line-through",
              secondaryTextMaterial: "text-neutral-500 line-through",
            }
          : {}),
        ...(disabled
          ? {
              primaryTextMaterial: "text-neutral-500 line-through",
              secondaryTextMaterial: "text-neutral-500 line-through",
            }
          : {}),
      }}
      link={!disabled}
      strongTitle={false}
      header={name}
      after={badge}
      footer={description}
      title={`${amount} ${currency}`}
      onClick={
        !disabled
          ? () =>
              void navigate(`assets/${assetId}/edit`, { viewTransition: true })
          : undefined
      }
    />
  );
}

function handleInstitutionSave(
  institutionValues: RecordDraftInstitutionSchema,
  institutionId?: string
) {
  if (institutionId === undefined) {
    const { name } = institutionValues;
    institutionId = `${name}`;
  }
  // TODO compare current values with initial to define isDirty
  const recordDraft = RecordDraft.instance;
  if (!recordDraft) throw Error("recordDraft instance not exist");
  const currentValues = recordDraft.getInstitutionData(institutionId);

  const keys = new Set([
    ...Object.keys(institutionId),
    ...(currentValues ? Object.keys(currentValues) : []),
  ]);

  for (const key of keys as Set<keyof RecordDraftInstitutionSchema>) {
    if (currentValues && institutionValues[key] !== currentValues[key]) {
      return recordDraft.saveInstitution(institutionId, {
        ...institutionValues,
        isDirty: true,
      });
    }
  }
  return recordDraft.saveInstitution(institutionId, {
    ...institutionValues,
    isDirty: false,
  });
}
