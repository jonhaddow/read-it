import { NextFunction, Response, Request } from "express";

export const isAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (!req.isAuthenticated()) res.status(401).end();
	next();
};
