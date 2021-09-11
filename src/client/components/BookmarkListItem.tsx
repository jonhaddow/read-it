import React, { ReactElement } from "react";
import { Bookmark } from "core/models";
import { useMutation } from "react-query";
import { useBookmarks } from "client/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaExternalLinkAlt } from "react-icons/fa";

export function BookmarkListItem({
	id,
	url,
	title,
	thumbnailUrl,
	dateCreated,
	minuteEstimate,
}: Bookmark): ReactElement {
	const { refetch } = useBookmarks();
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

	const shortUrl = new URL(url).hostname;

	dayjs.extend(relativeTime);
	const createdFromNow = dayjs(dateCreated).fromNow();

	const minutes = minuteEstimate ? Math.ceil(minuteEstimate) : 1;

	return (
		<li className="flex overflow-hidden items-center py-4 px-2 hover:bg-gray-50 border-b-2">
			<a href={url} className="group flex flex-col p-2">
				<h3 className="flex items-center mb-1 font-bold text-gray-700">
					{title}{" "}
					<FaExternalLinkAlt className="ml-2 text-gray-600 opacity-0 group-hover:opacity-100" />
				</h3>
				<span className="text-sm font-semibold text-gray-500">
					{shortUrl} - {createdFromNow} - {minutes} minute
					{minutes > 1 ? "s" : ""}
				</span>
			</a>
			<button
				className={`mr-2 ml-auto bg-red-100 p-2 text-sm rounded-lg hover:bg-red-200 ${
					isMutating ? "opacity-50" : ""
				}`}
				disabled={isMutating}
				onClick={async () => {
					await mutateAsync({ bookmarkId: id });
					await refetch();
				}}
			>
				Remove
			</button>
			{thumbnailUrl && (
				<img
					className="object-cover object-center w-14 h-14 border-r-2"
					src={thumbnailUrl}
					alt=""
				/>
			)}
		</li>
	);
}
