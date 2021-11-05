import React, { ReactElement } from "react";
import { Bookmark } from "core/models";
import { useMutation, useQueryClient } from "react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaLink } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { ResultSet } from "server/interfaces";
import { Api } from "client/services";
import { Modal } from ".";

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

		// Cancel pending fetches (as we will be optimistically updating state)
		await queryClient.cancelQueries("bookmarks");

		queryClient.setQueryData<ResultSet<Bookmark>>("bookmarks", (b) => ({
			results: b?.results?.filter((x) => x?.id !== bookmark.id) ?? [],
		}));

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
			<li className="group flex overflow-hidden flex-col md:flex-row md:py-4 md:px-2 my-2 md:mx-2 hover:bg-gray-50 border-b-2 shadow-md">
				{isMutating ? (
					<div>Removing...</div>
				) : (
					<>
						<a
							href={bookmark.url}
							target="_blank"
							rel="noreferrer"
							className="flex justify-center items-center w-full md:w-24 h-16 border"
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
						<div className="group flex flex-col flex-1 py-2 md:py-0 px-2">
							<div className="mb-2">
								<a
									href={bookmark.url}
									target="_blank"
									rel="noreferrer"
									className="items-center mb-1 w-auto font-bold text-gray-700"
								>
									{bookmark.title}
								</a>
								<span className="text-sm font-bold text-gray-500">
									{minuteWrapper ? ` - ${minuteWrapper}` : ""}
								</span>
							</div>
							<p className="hidden md:block mb-2 text-sm text-gray-600">
								{bookmark.description}
							</p>
							<span className="text-sm font-semibold text-gray-500 align-middle">
								<img
									className="inline mr-2 w-4 h-4"
									src={bookmark.favicon}
									alt=""
								/>
								{baseUrl} - {createdFromNow}
							</span>
						</div>
						<div className="flex md:flex-col justify-start p-2 md:p-0">
							<button
								className="mr-4 text-gray-500 hover:text-green-400 transition-colors"
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
						<div className="flex flex-row justify-evenly">
							<button
								className="py-1 px-3 m-3 mb-0 bg-primary-200 rounded-sm"
								onClick={() => {
									onDone();
								}}
							>
								Yes
							</button>
							<button
								className="py-1 px-3 m-3 mb-0 bg-gray-200 rounded-sm"
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
