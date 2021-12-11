import * as React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import useDarkMode from "use-dark-mode";

export function DarkModeToggle(): React.ReactElement | null {
	const darkMode = useDarkMode(true);

	return (
		<div className="absolute top-0 right-0 p-1">
			<button type="button" onClick={darkMode.toggle}>
				{darkMode.value ? <FaSun /> : <FaMoon />}
			</button>
		</div>
	);

	return null;
}
