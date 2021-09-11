import React, { ReactElement } from "react";
import { Bookmark } from "core/models";
import { useMutation, useQueryClient } from "react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaExternalLinkAlt, FaLink } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ResultSet } from "server/interfaces";

export function BookmarkListItem({
	id,
	url,
	title,
	thumbnailUrl,
	dateCreated,
	minuteEstimate,
}: Bookmark): ReactElement {
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
		await mutateAsync({ bookmarkId: id });

		// Cancel pending fetches (as we will be optimistically updating state)
		await queryClient.cancelQueries("bookmarks");

		queryClient.setQueryData<ResultSet<Bookmark>>("bookmarks", (bookmark) => ({
			results: bookmark?.results?.filter((x) => x?.id !== id) ?? [],
		}));
	}

	const shortUrl = new URL(url).hostname;

	dayjs.extend(relativeTime);
	const createdFromNow = dayjs(dateCreated).fromNow();

	const minutes = minuteEstimate ? Math.ceil(minuteEstimate) : 1;

	return (
		<li className="group flex overflow-hidden items-center py-4 px-2 hover:bg-gray-50 border-b-2">
			{isMutating ? (
				<div>Removing...</div>
			) : (
				<>
					<div className="group flex flex-col p-2">
						<h3 className="flex items-center mb-1 font-bold text-gray-700">
							{title}
						</h3>
						<span className="text-sm font-semibold text-gray-500">
							{shortUrl} - {createdFromNow} - {minutes} minute
							{minutes > 1 ? "s" : ""}
						</span>
					</div>
					<div className=" flex flex-1 gap-4 justify-start items-center">
						<a href={url} target="_blank" rel="noreferrer" className="">
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
						{thumbnailUrl ? (
							<img
								className="object-cover object-center border-r-2"
								src={thumbnailUrl}
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
