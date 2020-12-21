import {
	Column,
	Entity,
	Index,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
	constructor(email: string) {
		this.email = email;
	}

	@PrimaryGeneratedColumn()
	id!: number;

	@PrimaryColumn()
	email: string;

	@Index()
	@Column()
	providerId?: string;
}
