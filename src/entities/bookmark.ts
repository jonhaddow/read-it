import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Describes a bookmark of a website or web app.
 */
@Entity()
export class Bookmark {
	constructor(url: string) {
		this.url = url;
	}

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
	url: string;

	/**
	 * The title of the page this bookmark points to.
	 */
	@Column()
	title?: string;

	/**
	 * The description of the page this bookmark points to.
	 */
	@Column()
	description?: string;
}
