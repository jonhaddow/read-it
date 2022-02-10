import * as React from "react";
import { BookmarkParams } from "client/hooks";

const sortByOptions = [
	"Newly added",
	"Oldest added",
	"Longest content",
	"Shortest content",
] as const;

type SortOptions = typeof sortByOptions[number];

const sortMap: Record<
	SortOptions,
	{ order: BookmarkParams["order"]; sort: BookmarkParams["sort"] }
> = {
	"Longest content": {
		order: "desc",
		sort: "contentLength",
	},
	"Shortest content": {
		order: "asc",
		sort: "contentLength",
	},
	"Newly added": {
		order: "desc",
		sort: "dateCreated",
	},
	"Oldest added": {
		order: "asc",
		sort: "dateCreated",
	},
};

/**
 * A hook to get the current sort options.
 * @returns The selected sort option,
 * a function to update it,
 * the available sort options,
 * and a map of sort options to their corresponding sort parameters.
 */
export function useSortOptions(): {
	selected: SortOptions;
	setSelected: (i: SortOptions) => void;
	options: SortOptions[];
	selectedParams: {
		sort: BookmarkParams["sort"];
		order: BookmarkParams["order"];
	};
} {
	const [selectedSortBy, setSelectedSortBy] = React.useState<SortOptions>(
		sortByOptions[0]
	);

	return {
		selected: selectedSortBy,
		setSelected: setSelectedSortBy,
		options: [...sortByOptions],
		selectedParams: { ...sortMap[selectedSortBy] },
	};
}
