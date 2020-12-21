import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Express } from "express";
import config from "config";
import { getConnection } from "typeorm";
import { User } from "../entities";

const setupGoogleLogin = (): void => {
	const userRepository = getConnection().getRepository(User);
	passport.use(
		new GoogleStrategy(
			{
				clientID: config.get("google_auth.client_id"),
				clientSecret: config.get("google_auth.client_secret"),
				callbackURL: config.get("google_auth.callback_url"),
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await userRepository.findOne({
						where: { providerId: profile.id },
					});
					if (user) {
						done(undefined, user);
					} else {
						if (!profile.emails) {
							done("Email is required.");
							return;
						}
						user = new User(profile.emails[0].value);
						user.providerId = profile.id;
						await userRepository.insert(user);

						done(undefined, user);
					}
				} catch (ex) {
					done(ex);
				}
			}
		)
	);
};

export const setupPassport = (app: Express): void => {
	setupGoogleLogin();

	passport.serializeUser((user, cb) => cb(null, user));

	passport.deserializeUser((obj, cb) => cb(null, obj));

	app.use(passport.initialize());
	app.use(passport.session());
};
