import { BookmarkEditor, BookmarkList, Title } from "client/components";
import React from "react";

export const Dashboard: React.FC = () => {
	return (
		<div className="m-auto max-w-screen-md my-4">
			<header className="flex justify-between mb-6">
				<Title as="h1">Bookmarks</Title>
				<a className="text-sm hover:underline" href={`${API_URL}/api/logout`}>
					Log out
				</a>
			</header>
			<BookmarkList />
			<hr className="my-4" />
			<BookmarkEditor />
		</div>
	);
};
