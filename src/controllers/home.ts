import { Router } from "express";

export const homeRouter = Router();

homeRouter.get("/", (req, res): void => {
	res.render("home", { isAuthenticated: req.isAuthenticated() });
});
