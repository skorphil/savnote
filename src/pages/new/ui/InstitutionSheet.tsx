import { Badge, Fab, Link, List, ListItem } from "konsta/react";
import { type ReactElement, useEffect, useState } from "react";
import {
	MdAdd,
	MdDeleteOutline,
	MdInfoOutline,
	MdRestore,
} from "react-icons/md";
import { Sheet } from "react-modal-sheet";
import { type NavigateFunction, useNavigate, useParams } from "react-router";
import type {
	RecordDraftInstitutionSchema,
	ValueIds,
} from "@/features/create-record";
import { RecordDraft } from "@/features/create-record";
import { validateRecordDraftInstitution } from "@/features/create-record/model/validateRecordDraft";
import { BottomAppBar } from "./BottomAppBar";

export function InstitutionSheet() {
	const navigate = useNavigate();
	const { institutionId } = useParams();
	const [isOpen, setIsOpen] = useState<boolean>(true);

	const recordDraftInstance = RecordDraft.instance;
	const institutionAssetsIds = recordDraftInstance?.useInstitutionAssets(
		institutionId ?? "",
	);
	const institutionDataRaw = recordDraftInstance?.useInstitutionData(
		institutionId ?? "",
	);

	let institutionData: RecordDraftInstitutionSchema | null = null;
	let shouldNavigate = false;

	if (!institutionId || !recordDraftInstance) {
		shouldNavigate = true;
	} else {
		try {
			if (institutionDataRaw !== undefined) {
				institutionData = validateRecordDraftInstitution(institutionDataRaw);
			}
		} catch (e) {
			void e;
			shouldNavigate = true;
		}
	}

	useEffect(() => {
		if (shouldNavigate) {
			void navigate("/newrecord", { replace: true });
		}
	}, [shouldNavigate, navigate]);

	if (shouldNavigate) return null;
	if (!institutionData) return null;

	const bottomLeftButtons = institutionData.isDeleted
		? [
				<Link
					key="restore"
					onClick={() => {
						const updatedState = {
							...institutionData,
							isDeleted: false,
						};
						void handleInstitutionSave(updatedState, institutionId);
					}}
					// @ts-expect-error - navbar prop exists at runtime in Konsta
					navbar
				>
					<MdRestore size={24} />
				</Link>,
			]
		: [
				<Link
					key="delete"
					onClick={() => {
						setIsOpen(false);
						void navigate("/newrecord", { replace: true });

						const updatedState = {
							...institutionData,
							isDeleted: true,
						};
						void handleInstitutionSave(updatedState, institutionId);
					}}
					// @ts-expect-error - navbar prop exists at runtime in Konsta
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
			// dragVelocityThreshold={100}
			dragCloseThreshold={0.2}
			isOpen={isOpen}
			onClose={() => {
				setIsOpen(false);
				void navigate("/newrecord", { replace: true });
			}}
			detent="content"
		>
			<Sheet.Container>
				<Sheet.Header />
				<Sheet.Content disableDrag className="h-[400px]">
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
					<div className="pb-[40px]">
						<List className="mt-4 mb-14">
							{institutionAssetsIds
								?.map((assetId) => {
									const isDeleted =
										recordDraftInstance?.getAssetData(assetId)?.isDeleted;
									if (isDeleted === undefined) return null;
									return {
										assetId,
										isDeleted,
									};
								})
								.filter(
									(
										item,
									): item is {
										assetId: string;
										isDeleted: boolean;
									} => item !== null,
								)
								.sort((a, b) => Number(a.isDeleted) - Number(b.isDeleted))
								.map(({ assetId }) => (
									<AssetListItem
										key={assetId}
										navigate={navigate}
										assetId={assetId as ValueIds<"assets">}
										disabled={institutionData.isDeleted}
									/>
								))}
						</List>
					</div>
				</Sheet.Content>
			</Sheet.Container>
		</Sheet>
	);
}

function AssetListItem({
	assetId,
	navigate,
	disabled,
}: {
	assetId: ValueIds<"assets">;
	navigate: NavigateFunction;
	disabled?: boolean;
}) {
	const recordDraft = RecordDraft.instance;
	const { name, amount, currency, description, isDirty, isDeleted, isNew } =
		recordDraft?.useAssetData(assetId) || {};

	if (!recordDraft) return null;

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
	institutionId?: string,
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
		...Object.keys(institutionValues),
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
