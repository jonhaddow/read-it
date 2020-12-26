import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	constructor(email: string) {
		this.email = email;
	}

	@PrimaryGeneratedColumn()
	id!: number;

	@Index()
	@Column({
		unique: true,
	})
	email: string;

	@Index()
	@Column({ nullable: true })
	providerId?: string;

	@Index()
	@Column({ nullable: true })
	provider?: string;

	@Column({ nullable: true })
	hashedPassword?: string;
}
