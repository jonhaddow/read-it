import * as React from "react";

interface PaginationProps {
	/**
	 * The index to start from.
	 */
	skip: number;

	/**
	 * The number of items per page.
	 */
	take: number;

	/**
	 * The total number of items.
	 */
	total: number;

	/**
	 * An event triggered when the page number changes.
	 */
	onChange: (skip: number, take: number) => void;
}
export function Pagination(props: PaginationProps): React.ReactElement | null {
	const showPrev = props.skip > 0;
	const showNext = props.skip + props.take < props.total;

	return (
		<div className="flex justify-center items-center p-2">
			{showPrev && (
				<NavButton
					onClick={() =>
						props.onChange(Math.max(0, props.skip - props.take), props.take)
					}
				>
					Previous
				</NavButton>
			)}
			<span className="p-2 mx-auto text-sm font-bold text-text-secondary uppercase">
				{props.skip + 1} - {Math.min(props.total, props.skip + props.take)} /{" "}
				{props.total}
			</span>
			{showNext && (
				<NavButton
					onClick={() => props.onChange(props.skip + props.take, props.take)}
				>
					Next
				</NavButton>
			)}
		</div>
	);
}

interface NavButtonProps {
	onClick: () => void;
	children: React.ReactNode;
}
function NavButton(props: NavButtonProps): React.ReactElement {
	return (
		<button
			className="p-2 text-text-secondary bg-background hover:bg-background-hover rounded-lg transition-colors"
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
