import passport, { Profile } from "passport";
import {
	Strategy as GoogleStrategy,
	VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import { getRepository } from "typeorm";
import { compare } from "bcrypt";
import { UserEntity } from "../entities";
import { User } from "core/models";

const handleIdentity = async (
	profile: Profile,
	done: VerifyCallback
): Promise<void> => {
	const userRepository = getRepository(UserEntity);
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
				user = { email: profile.emails[0].value };
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
				clientID: process.env.GOOGLE_AUTH_ID || "",
				clientSecret: process.env.GOOGLE_AUTH_SECRET || "",
				callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL || "",
			},
			async (_accessToken, _refreshToken, profile, done) => {
				await handleIdentity(profile, done);
			}
		)
	);
};

const setupGithub = (): void => {
	passport.use(
		new GitHubStrategy(
			{
				clientID: process.env.GITHUB_AUTH_ID || "",
				clientSecret: process.env.GITHUB_AUTH_SECRET || "",
				callbackURL: process.env.GITHUB_AUTH_CALLBACK_URL || "",
			},
			async (
				_accessToken: string,
				_refreshToken: string,
				profile: Profile,
				done: VerifyCallback
			) => {
				await handleIdentity(profile, done);
			}
		)
	);
};

const setupLocal = (): void => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: "username",
				passwordField: "password",
				passReqToCallback: false,
				session: true,
			},
			async (
				username: string,
				password: string,
				done: (
					error: string | null,
					user?: User | false,
					options?: IVerifyOptions
				) => void
			) => {
				const userRepository = getRepository(UserEntity);
				const user = await userRepository.findOne({
					where: {
						email: username,
					},
				});

				if (!user || !user.hashedPassword) return done(null, false);

				try {
					const verifyResult = await compare(password, user.hashedPassword);
					if (!verifyResult) {
						return done(null, false);
					}
				} catch (ex) {
					return done(null, false);
				}
				return done(null, user);
			}
		)
	);
};

export const setupPassport = (app: Express): void => {
	setupLocal();

	// External authentication methods
	setupGoogleLogin();
	setupGithub();

	passport.serializeUser((user, cb) => cb(null, user));

	passport.deserializeUser<Express.User>((obj, cb) => cb(null, obj));

	app.use(passport.initialize());
	app.use(passport.session());
};
