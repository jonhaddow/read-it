import * as React from "react";

interface PaginationProps {
	/**
	 * The total number of items.
	 */
	totalItems: number;

	/**
	 * The number of items per page.
	 */
	itemsPerPage: number;
}
export function Pagination(props: PaginationProps): React.ReactElement | null {
	// Determine the number of pages
	const numPages = Math.ceil(props.totalItems / props.itemsPerPage);

	const [currentPage, setCurrentPage] = React.useState(1);

	return (
		<div>
			<button
				disabled={currentPage <= 1}
				onClick={() => {
					if (currentPage > 1) {
						setCurrentPage(currentPage - 1);
					}
				}}
			>
				Previous
			</button>
			Page {currentPage} of {numPages}
			<button
				disabled={currentPage >= numPages}
				onClick={() => {
					if (currentPage < numPages) {
						setCurrentPage(currentPage + 1);
					}
				}}
			>
				Next
			</button>
		</div>
	);
}
