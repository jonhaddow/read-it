import { EntitySchema } from "typeorm";
import { Bookmark } from "core/models";

export enum BookmarkState {
	CREATED = "created",
	PROCESSED = "processed",
	ARCHIVED = "archived",
}

export const BookmarkEntity = new EntitySchema<Bookmark>({
	name: "bookmark",
	columns: {
		id: {
			type: Number,
			primary: true,
			generated: true,
		},
		dateCreated: {
			type: Date,
			createDate: true,
		},
		url: {
			type: String,
			length: 2000,
		},
		title: {
			type: String,
			nullable: true,
		},
		description: {
			type: String,
			nullable: true,
		},
		minuteEstimate: {
			type: "decimal",
			nullable: true,
		},
		state: {
			type: "enum",
			enum: BookmarkState,
			default: BookmarkState.CREATED,
		},
		targetURL: {
			type: String,
			nullable: true,
		},
		thumbnailUrl: {
			type: String,
			nullable: true,
		},
		specialType: {
			type: String,
			nullable: true,
		},
		favicon: {
			type: String,
			nullable: true,
		},
	},
	relations: {
		user: {
			type: "many-to-one",
			target: "user", // UserEntity
		},
	},
	orderBy: {
		dateCreated: "DESC",
	},
});
