import { BookmarkEditor, BookmarkList } from "client/components";
import React from "react";

export const Dashboard: React.FC = () => {
	return (
		<>
			<a href={`${API_URL}/api/logout`}>Log out</a>
			<h1>Bookmarks</h1>
			<BookmarkList />
			<BookmarkEditor />
		</>
	);
};
