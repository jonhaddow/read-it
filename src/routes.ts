import { Request, Response } from "express";
import { getBookmarksApi } from "./api";

export const AppRoutes: {
	path: string;
	method: "get" | "post" | "put" | "delete";
	action: (req: Request, res: Response) => Promise<void>;
}[] = [
	{
		path: "/api/bookmarks",
		method: "get",
		action: getBookmarksApi,
	},
];
