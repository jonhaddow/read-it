import { User } from "core/models";
import { EntitySchema } from "typeorm";

export const UserEntity = new EntitySchema<User>({
	name: "user",
	columns: {
		id: {
			type: Number,
			primary: true,
			generated: true,
		},
		email: {
			type: String,
			unique: true,
		},
		hashedPassword: {
			type: String,
			nullable: true,
		},
		providerId: {
			type: String,
			nullable: true,
		},
		provider: {
			type: String,
			nullable: true,
		},
	},
	indices: [
		{
			columns: ["email", "providerId", "provider"],
		},
	],
});
