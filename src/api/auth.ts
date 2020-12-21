import { Router } from "express";
import passport from "passport";

export const authRouter = Router();

authRouter.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);
authRouter.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req, res) => res.redirect("/")
);
