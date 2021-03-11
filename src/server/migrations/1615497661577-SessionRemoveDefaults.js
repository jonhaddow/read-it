const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class SessionRemoveDefaults1615497661577 {
	name = "SessionRemoveDefaults1615497661577";

	async up(queryRunner) {
		await queryRunner.query(`COMMENT ON COLUMN "session"."expiredAt" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "expiredAt" DROP DEFAULT`
		);
		await queryRunner.query(`COMMENT ON COLUMN "session"."id" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "id" DROP DEFAULT`
		);
		await queryRunner.query(`COMMENT ON COLUMN "session"."json" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "json" DROP DEFAULT`
		);
	}

	async down(queryRunner) {
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "json" SET DEFAULT ''`
		);
		await queryRunner.query(`COMMENT ON COLUMN "session"."json" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "id" SET DEFAULT ''`
		);
		await queryRunner.query(`COMMENT ON COLUMN "session"."id" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "expiredAt" SET DEFAULT '1615497322884'`
		);
		await queryRunner.query(`COMMENT ON COLUMN "session"."expiredAt" IS NULL`);
	}
};
