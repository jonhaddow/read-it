/**
 * Describes a user within the system.
 */
export interface User {
	/**
	 * The unique identifier of the user.
	 */
	id?: number;

	/**
	 * The email associated with the user.
	 */
	email: string;

	/**
	 * The identifier associated with the user from the OAuth provider.
	 */
	providerId?: string;

	/**
	 * The OAuth provider this user used to sign in.
	 */
	provider?: string;

	/**
	 * The hashed password if locally authenticated.
	 */
	hashedPassword?: string;
}
