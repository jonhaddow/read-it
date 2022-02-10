import { useClickAway } from "client/hooks";
import * as React from "react";
import { usePopper } from "react-popper";

interface DropdownProps<T> {
	items: T[];
	onSelect: (item: T) => void;
	selectedItem: T;
}

export function Dropdown<T>(
	props: DropdownProps<T>
): React.ReactElement | null {
	const [isOpen, setIsOpen] = React.useState(false);

	const [referenceElement, setReferenceElement] =
		React.useState<HTMLDivElement | null>(null);
	const [popperElement, setPopperElement] =
		React.useState<HTMLDivElement | null>(null);
	const [arrowElement, setArrowElement] = React.useState<HTMLDivElement | null>(
		null
	);

	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement: "bottom-end",
		modifiers: [{ name: "arrow", options: { element: arrowElement } }],
	});

	useClickAway(referenceElement, () => setIsOpen(false));

	return (
		<div className="mx-2">
			<label htmlFor="dropdown" className="pr-2 text-text-secondary">
				Sort by:
			</label>
			<div ref={setReferenceElement} className="inline">
				<button id="dropdown" onClick={() => setIsOpen(!isOpen)}>
					{props.selectedItem}
				</button>
			</div>
			{isOpen && (
				<div
					className="z-10"
					ref={setPopperElement}
					{...attributes.popper}
					style={styles.popper}
				>
					<div
						ref={setArrowElement}
						style={styles.arrow}
						className="border-8 border-x-transparent border-t-transparent border-b-card-shade border-solid rotate-[-135deg]"
					/>
					<ul className="overflow-hidden mt-4 bg-card-shade rounded-lg shadow-lg">
						{props.items.map((item, index) => (
							<li key={index} className="text-sm hover:bg-card-shade-hover">
								<button
									className="p-2 w-full h-full"
									onClick={() => props.onSelect(item)}
								>
									{item}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
