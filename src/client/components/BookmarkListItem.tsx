import React, { ReactElement } from "react";
import { Bookmark } from "core/models";
import { useMutation, useQueryClient } from "react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaExternalLinkAlt, FaLink } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ResultSet } from "server/interfaces";

export function BookmarkListItem(bookmark: Bookmark): ReactElement {
	const queryClient = useQueryClient();
	const { mutateAsync, isLoading: isMutating } = useMutation(
		async ({
			bookmarkId,
		}: {
			bookmarkId: number | undefined;
		}): Promise<void> => {
			if (bookmarkId)
				await fetch(`/api/bookmarks/${bookmarkId}`, {
					method: "DELETE",
				});
		}
	);

	async function onDelete(): Promise<void> {
		// Delete the bookmark
		await mutateAsync({ bookmarkId: bookmark.id });

		// Cancel pending fetches (as we will be optimistically updating state)
		await queryClient.cancelQueries("bookmarks");

		queryClient.setQueryData<ResultSet<Bookmark>>("bookmarks", (b) => ({
			results: b?.results?.filter((x) => x?.id !== bookmark.id) ?? [],
		}));
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
		<li className="group flex overflow-hidden items-center py-4 px-2 hover:bg-gray-50 border-b-2">
			{isMutating ? (
				<div>Removing...</div>
			) : (
				<>
					<div className="group flex flex-col p-2">
						<h3 className="flex items-center mb-1 font-bold text-gray-700">
							{bookmark.title}
						</h3>
						<span className="text-sm font-semibold text-gray-500 align-middle">
							<img
								className="inline mr-2 w-4 h-4"
								src={bookmark.favicon}
								alt=""
							/>
							{baseUrl} - {createdFromNow}
							{minuteWrapper ? `- ${minuteWrapper}` : ""}
						</span>
					</div>
					<div className=" flex flex-1 gap-4 justify-start items-center">
						<a
							href={bookmark.url}
							target="_blank"
							rel="noreferrer"
							className=""
						>
							<FaExternalLinkAlt className="ml-2 text-gray-600" />
						</a>
						<button
							className="mr-2 text-gray-500 hover:text-red-400 transition-colors"
							onClick={onDelete}
						>
							<MdDelete size={24} />
							<span className="sr-only">Delete</span>
						</button>
					</div>

					<div className="flex justify-center items-center w-14 h-14 border">
						{bookmark.thumbnailUrl ? (
							<img
								className="object-cover object-center border-r-2"
								src={bookmark.thumbnailUrl}
								alt=""
							/>
						) : (
							<FaLink />
						)}
					</div>
				</>
			)}
		</li>
	);
}
