import { Router } from "express";
import passport from "passport";

export const authRouter = Router();

const clientUrl = process.env.CLIENT_URL || "";
const homeRedirect = clientUrl;
const loginRedirect = `${clientUrl}/login`;

const encodeState = (obj: Record<string, unknown>): string | undefined => {
	return obj ? Buffer.from(JSON.stringify(obj)).toString("base64") : undefined;
};

const decodeState = (base64: string | undefined): Record<string, unknown> => {
	return base64
		? (JSON.parse(Buffer.from(base64, "base64").toString()) as Record<
				string,
				unknown
		  >)
		: {};
};

authRouter.get("/api/auth/google", (req, res, next) => {
	const { returnTo } = req.query;
	const authenticator = passport.authenticate("google", {
		scope: ["profile", "email"],
		state: encodeState({ returnTo }),
	});
	authenticator(req, res, next);
});
authRouter.get(
	"/api/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: loginRedirect,
	}),
	(req, res) => {
		try {
			const { state }: { state?: string } = req.query;
			const { returnTo } = decodeState(state);
			if (typeof returnTo === "string" && returnTo.startsWith("/")) {
				return res.redirect(homeRedirect + returnTo);
			}
		} catch {
			// just redirect normally below
		}
		res.redirect(homeRedirect);
	}
);

authRouter.get("/api/auth/github", (req, res, next) => {
	const { returnTo } = req.query;
	const authenticator = passport.authenticate("github", {
		scope: ["user:email"],
		state: encodeState({ returnTo }),
	});
	authenticator(req, res, next);
});

authRouter.get(
	"/api/auth/github/callback",
	passport.authenticate("github", {
		failureRedirect: loginRedirect,
	}),
	(req, res) => {
		try {
			const { state }: { state?: string } = req.query;
			const { returnTo } = decodeState(state);
			if (typeof returnTo === "string" && returnTo.startsWith("/")) {
				return res.redirect(homeRedirect + returnTo);
			}
		} catch {
			// just redirect normally below
		}
		res.redirect(homeRedirect);
	}
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
