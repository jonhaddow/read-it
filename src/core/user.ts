export interface User {
	id: number;
	email: string;
	providerId?: string;
	provider?: string;
	hashedPassword?: string;
}
