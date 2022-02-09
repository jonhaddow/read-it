import * as React from "react";

/**
 * A hook to trigger a callback when a click is detected outside an element.
 * @param referenceElement The element to detect clicks outside of.
 * @param callback The callback to trigger.
 */
export function useClickAway(
	referenceElement: HTMLElement | null,
	callback: () => void
): void {
	React.useEffect(() => {
		const handleClickAway = (event: MouseEvent): void => {
			if (
				referenceElement &&
				!referenceElement.contains(event.target as Node)
			) {
				callback();
			}
		};

		document.addEventListener("click", handleClickAway);

		return () => {
			document.removeEventListener("click", handleClickAway);
		};
	}, [callback, referenceElement]);
}
