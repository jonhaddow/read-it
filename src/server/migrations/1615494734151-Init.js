const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Init1615494734151 {
	name = "Init1615494734151";

	async up(queryRunner) {
		await queryRunner.query(
			`CREATE TABLE "session" ("expiredAt" bigint NOT NULL, "id" character varying(255) NOT NULL, "json" text NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_28c5d1d16da7908c97c9bc2f74" ON "session" ("expiredAt") `
		);
		await queryRunner.query(
			`CREATE TYPE "bookmark_state_enum" AS ENUM('created', 'processed', 'archived')`
		);
		await queryRunner.query(
			`CREATE TABLE "bookmark" ("id" SERIAL NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "url" character varying(2000) NOT NULL, "title" character varying, "description" character varying, "minuteEstimate" numeric, "state" "bookmark_state_enum" NOT NULL DEFAULT 'created', "targetURL" character varying, "thumbnailUrl" character varying, "specialType" character varying, "userId" integer, CONSTRAINT "PK_b7fbf4a865ba38a590bb9239814" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "hashedPassword" character varying, "providerId" character varying, "provider" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_7ef19d8762ca37f3d04cbde254" ON "user" ("email", "providerId", "provider") `
		);
		await queryRunner.query(
			`ALTER TABLE "bookmark" ADD CONSTRAINT "FK_e389fc192c59bdce0847ef9ef8b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}

	async down(queryRunner) {
		await queryRunner.query(
			`ALTER TABLE "bookmark" DROP CONSTRAINT "FK_e389fc192c59bdce0847ef9ef8b"`
		);
		await queryRunner.query(`DROP INDEX "IDX_7ef19d8762ca37f3d04cbde254"`);
		await queryRunner.query(`DROP TABLE "user"`);
		await queryRunner.query(`DROP TABLE "bookmark"`);
		await queryRunner.query(`DROP TYPE "bookmark_state_enum"`);
		await queryRunner.query(`DROP INDEX "IDX_28c5d1d16da7908c97c9bc2f74"`);
		await queryRunner.query(`DROP TABLE "session"`);
	}
};
