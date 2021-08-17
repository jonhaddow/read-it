import { useBookmarks } from "client/hooks";
import React from "react";
import { useMutation } from "react-query";
import { StateMessage } from ".";

export const BookmarkList: React.FC = () => {
	const { data, isLoading, refetch } = useBookmarks();

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

	if (isLoading) return <StateMessage>Loading...</StateMessage>;

	return (
		<>
			{data?.results.length ? (
				<ul>
					{data.results.map(({ id, url, title, thumbnailUrl }) => (
						<li
							key={id}
							className="my-4 bg-gray-100 rounded-xl shadow-md flex items-center overflow-hidden h-14"
						>
							{thumbnailUrl && (
								<img
									className="h-full object-cover object-center border-r-2"
									src={thumbnailUrl}
									alt=""
								/>
							)}
							<a href={url} className="p-2">
								<span>{url}</span> - <span>{title}</span>
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
						</li>
					))}
				</ul>
			) : (
				<StateMessage>No bookmarks</StateMessage>
			)}
		</>
	);
};
