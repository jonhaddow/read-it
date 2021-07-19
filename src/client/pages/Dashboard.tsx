import { BookmarkEditor, BookmarkList, Modal, Title } from "client/components";
import React, { useState } from "react";

export const Dashboard: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div className="m-auto max-w-screen-md my-4 p-4">
			<header className="flex flex-wrap mb-6 items-center">
				<Title className="flex-grow" as="h1">
					Bookmarks
				</Title>
				<button
					className="rounded-lg bg-blue-100 hover:bg-blue-300 transition-colors px-2 py-1 mr-4 focus:outline-black"
					onClick={() => setIsOpen(true)}
				>
					Create bookmark
				</button>
				<a className="text-sm hover:underline" href={`${API_URL}/api/logout`}>
					Log out
				</a>
			</header>
			<BookmarkList />
			{isOpen && (
				<Modal title="Create Bookmark" close={() => setIsOpen(false)}>
					<BookmarkEditor onSave={() => setIsOpen(false)} />
				</Modal>
			)}
		</div>
	);
};
