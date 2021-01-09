import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from ".";

export enum BookmarkState {
	CREATED = "created",
	PROCESSED = "processed",
	ARCHIVED = "archived",
}

/**
 * Describes a bookmark of a website or web app.
 */
@Entity({
	orderBy: {
		dateCreated: "DESC",
	},
})
export class Bookmark {
	/**
	 * A auto generated unique identifier for this bookmark.
	 */
	@PrimaryGeneratedColumn()
	id!: number;

	/**
	 * The absolute url for the bookmark.
	 */
	@Column({
		length: 2000, // Max-length of URL
	})
	url!: string;

	/**
	 * The title of the page this bookmark points to.
	 */
	@Column({ nullable: true })
	title?: string;

	/**
	 * The description of the page this bookmark points to.
	 */
	@Column({ nullable: true })
	description?: string;

	/**
	 * The date the bookmark was created.
	 */
	@CreateDateColumn()
	dateCreated!: Date;

	@Column({
		type: "enum",
		enum: BookmarkState,
		default: BookmarkState.CREATED,
	})
	state!: BookmarkState;

	/**
	 * The user this bookmark belongs to.
	 */
	@ManyToOne(() => User)
	user!: User;

	validate(): { error?: string } {
		if (this.url) {
			try {
				new URL(this.url);
			} catch (_) {
				return { error: "Bookmark URL invalid" };
			}
		} else {
			return { error: "Bookmark URL required" };
		}
		return {};
	}
}
