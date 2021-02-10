import { Router } from "express";
import passport from "passport";
import config from "config";

export const authRouter = Router();

const clientUrl = config.get<string>("client_url");
const homeRedirect = clientUrl;
const loginRedirect = `${clientUrl}/login`;

authRouter.get(
	"/api/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);
authRouter.get(
	"/api/auth/google/callback",
	passport.authenticate("google", {
		successRedirect: homeRedirect,
		failureRedirect: loginRedirect,
	})
);

authRouter.get(
	"/api/auth/github",
	passport.authenticate("github", {
		scope: ["user:email"],
	})
);

authRouter.get(
	"/api/auth/github/callback",
	passport.authenticate("github", {
		successRedirect: homeRedirect,
		failureRedirect: loginRedirect,
	})
);

authRouter.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: homeRedirect,
		failureRedirect: loginRedirect,
	})
);

authRouter.get("/api/logout", (req, res) => {
	req.logout();
	res.redirect(loginRedirect);
});
