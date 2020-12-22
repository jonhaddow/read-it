import passport, { Profile } from "passport";
import {
	Strategy as GoogleStrategy,
	VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Express } from "express";
import config from "config";
import { getConnection } from "typeorm";
import { User } from "../entities";

const handleIdentity = async (
	profile: Profile,
	done: VerifyCallback
): Promise<void> => {
	const userRepository = getConnection().getRepository(User);
	try {
		let user = await userRepository.findOne({
			where: {
				providerId: profile.id,
				provider: profile.provider,
			},
		});
		if (user) {
			done(undefined, user);
		} else {
			if (!profile.emails) {
				done("Email is required.");
				return;
			}

			user = await userRepository.findOne({
				where: { email: profile.emails[0].value },
			});

			if (!user) {
				user = new User(profile.emails[0].value);
				user.providerId = profile.id;
				user.provider = profile.provider;
				await userRepository.insert(user);
			}

			done(undefined, user);
		}
	} catch (ex) {
		done(ex);
	}
};

const setupGoogleLogin = (): void => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: config.get("google_auth.client_id"),
				clientSecret: config.get("google_auth.client_secret"),
				callbackURL: config.get("google_auth.callback_url"),
			},
			async (accessToken, refreshToken, profile, done) => {
				await handleIdentity(profile, done);
			}
		)
	);
};

const setupGithub = (): void => {
	passport.use(
		new GitHubStrategy(
			{
				clientID: config.get("github_auth.client_id"),
				clientSecret: config.get("github_auth.client_secret"),
				callbackURL: config.get("github_auth.callback_url"),
			},
			async (
				accessToken: string,
				refreshToken: string,
				profile: Profile,
				done: VerifyCallback
			) => {
				await handleIdentity(profile, done);
			}
		)
	);
};

export const setupPassport = (app: Express): void => {
	setupGoogleLogin();
	setupGithub();

	passport.serializeUser((user, cb) => cb(null, user));

	passport.deserializeUser((obj, cb) => cb(null, obj));

	app.use(passport.initialize());
	app.use(passport.session());
};
