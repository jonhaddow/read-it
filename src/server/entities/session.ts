import { ISession } from "connect-typeorm";
import { EntitySchema } from "typeorm";

export const SessionEntity = new EntitySchema<ISession>({
	name: "session",
	columns: {
		expiredAt: {
			type: "bigint",
		},
		id: {
			primary: true,
			type: "varchar",
			length: 255,
		},
		json: {
			type: "text",
		},
	},
	indices: [
		{
			columns: ["expiredAt"],
		},
	],
});
