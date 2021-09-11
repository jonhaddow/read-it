import { BookmarkEditor, BookmarkList, Modal, Title } from "client/components";
import React, { useState } from "react";

export const Dashboard: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div className="p-4 m-auto my-4 max-w-screen-md">
			<header className="flex flex-wrap items-center mb-6">
				<Title className="flex-grow" as="h1">
					Bookmarks
				</Title>
				<button
					className="py-1 px-2 mr-4 bg-primary-100 hover:bg-primary-300 rounded-lg transition-colors focus:outline-black"
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
