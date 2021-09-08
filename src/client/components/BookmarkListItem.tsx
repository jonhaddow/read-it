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
		<li className="py-4 px-2 border-b-2 flex items-center overflow-hidden hover:bg-gray-50">
			<a href={url} className="p-2 flex flex-col group">
				<h3 className="font-bold mb-1 text-gray-700 flex items-center">
					{title}{" "}
					<FaExternalLinkAlt className="ml-2 opacity-0 text-gray-600 group-hover:opacity-100" />
				</h3>
				<span className="text-sm text-gray-500 font-semibold">
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
					className="object-cover object-center border-r-2 w-14 h-14"
					src={thumbnailUrl}
					alt=""
				/>
			)}
		</li>
	);
}
