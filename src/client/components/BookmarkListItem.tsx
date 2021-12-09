import React, { ReactElement } from "react";
import { Bookmark } from "core/models";
import { useMutation, useQueryClient } from "react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaLink } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { Api } from "client/services";
import { Modal } from ".";
import { bookmarkKeys } from "client/hooks";

export function BookmarkListItem(bookmark: Bookmark): ReactElement {
	const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

	const queryClient = useQueryClient();
	const { mutateAsync, isLoading: isMutating } = useMutation(
		async ({
			bookmarkId,
		}: {
			bookmarkId: number | undefined;
		}): Promise<void> => {
			if (bookmarkId) await Api.del(`/api/bookmarks/${bookmarkId}`);
		}
	);

	async function onDone(): Promise<void> {
		// Delete the bookmark
		await mutateAsync({ bookmarkId: bookmark.id });

		// Invalidate existing queries (this will trigger refresh)
		queryClient.invalidateQueries(bookmarkKeys.all());

		// Close modal
		setDeleteModalOpen(false);
	}

	const baseUrl = new URL(bookmark.url).hostname;

	dayjs.extend(relativeTime);
	const createdFromNow = dayjs(bookmark.dateCreated).fromNow();

	const minutes = bookmark.minuteEstimate
		? Math.ceil(bookmark.minuteEstimate)
		: undefined;
	const minuteWrapper =
		minutes !== undefined ? `${minutes} minute${minutes > 1 ? "s" : ""}` : null;

	return (
		<>
			<li className="overflow-hidden relative m-2 bg-card-shade hover:bg-card-shade-hover shadow-md hover:shadow-lg transition-colors">
				{isMutating ? (
					<div>Removing...</div>
				) : (
					<>
						<div className="flex p-2">
							<a
								href={bookmark.url}
								target="_blank"
								rel="noreferrer"
								className="flex justify-center items-center self-center w-24 md:w-32 h-16 md:h-24 border"
							>
								{bookmark.thumbnailUrl ? (
									<img
										className="object-cover object-center w-full h-full"
										src={bookmark.thumbnailUrl}
										alt=""
									/>
								) : (
									<FaLink />
								)}
							</a>
							<div className="flex flex-col flex-1 py-0 px-4 mr-8">
								<div className="flex flex-1 mb-2">
									<a
										href={bookmark.url}
										target="_blank"
										rel="noreferrer"
										className="items-center mr-2 mb-1 w-auto font-bold text-text-main line-clamp-3"
									>
										{bookmark.title}
									</a>
									{minuteWrapper && (
										<span className="overflow-hidden flex-shrink-0 ml-auto text-sm font-bold text-text-dimmed whitespace-nowrap">
											{minuteWrapper}
										</span>
									)}
								</div>
								{bookmark.description && (
									<p className="hidden overflow-hidden mb-2 text-sm text-text-main md:line-clamp-2">
										{bookmark.description}
									</p>
								)}
								<span className="text-sm font-semibold text-text-dimmed align-middle">
									<img
										className="inline mr-2 w-4 h-4"
										src={bookmark.favicon}
										alt=""
									/>
									{baseUrl} - {createdFromNow}
								</span>
							</div>
						</div>
						<div className="flex absolute top-0 right-0 flex-col justify-start items-center p-0 h-full">
							<button
								className="m-2 text-text-main hover:text-red-400 transition-colors"
								onClick={() => setDeleteModalOpen(true)}
							>
								<TiTick size={24} />
								<span className="sr-only">Done</span>
							</button>
						</div>
					</>
				)}
			</li>
			{deleteModalOpen && (
				<Modal close={() => setDeleteModalOpen(false)}>
					<div className="flex flex-col p-2">
						<span>Are you sure you want to delete this bookmark?</span>
						<div className="flex flex-row justify-center mt-4">
							<button
								className="py-1 px-3 m-1 mb-0 text-text-main bg-warning hover:bg-warning-hover rounded-sm"
								onClick={() => {
									onDone();
								}}
							>
								Yes
							</button>
							<button
								className="py-1 px-3 m-1 mb-0"
								onClick={() => setDeleteModalOpen(false)}
							>
								No
							</button>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
}
