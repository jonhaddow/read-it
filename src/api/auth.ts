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

authRouter.get(
	"/auth/github",
	passport.authenticate("github", {
		scope: ["user:email"],
	})
);

authRouter.get(
	"/auth/github/callback",
	passport.authenticate("github", { failureRedirect: "/login" }),
	(req, res) => res.redirect("/")
);
