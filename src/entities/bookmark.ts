import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from ".";

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
	@Column()
	dateCreated!: Date;

	/**
	 * The user this bookmark belongs to.
	 */
	@ManyToOne(() => User)
	user!: User;
}
