import { bookmarkKeys } from "client/hooks";
import { Api } from "client/services";
import React, { ReactElement, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

interface BookmarkEditorProps {
	onSave: () => void;
}

export const BookmarkEditor = ({
	onSave,
}: BookmarkEditorProps): ReactElement => {
	const [url, setUrl] = useState<string>("");

	const queryClient = useQueryClient();

	const { mutateAsync, isLoading } = useMutation(
		async (createBookmarkModel: { url: string; title?: string }) => {
			const response = await Api.post("/api/bookmarks", {
				url: createBookmarkModel.url,
				title: createBookmarkModel.title,
			});
			if (!response.ok) {
				throw new Error("Network response failed");
			}
			return response;
		}
	);

	return (
		<form
			className="m-auto max-w-sm"
			onSubmit={async (e) => {
				e.preventDefault();

				// Add the new bookmark
				const response = await mutateAsync({ url });
				await response.json();

				// Invalidate the previous queries (this will automatically update the list)
				queryClient.invalidateQueries(bookmarkKeys.all());
				onSave();
			}}
		>
			<div className="block pb-5">
				<label
					htmlFor="url"
					className="block py-4 px-2 text-sm tracking-wider leading-3 text-text-main uppercase"
				>
					Add a link
				</label>
				<input
					id="url"
					className="py-2 px-4 w-72 bg-background rounded-2xl border border-gray-500 outline-none focus:shadow-md"
					name="url"
					type="url"
					value={url}
					onChange={(e) => {
						setUrl(e.target.value);
					}}
				/>
			</div>
			<button
				disabled={!url}
				className={`${
					url && !isLoading
						? "hover:bg-primary-hover"
						: "cursor-default opacity-70"
				} text-text-light focus:border-black outline-none bg-primary py-2 px-3 rounded-lg`}
				type="submit"
			>
				Create
			</button>
		</form>
	);
};
