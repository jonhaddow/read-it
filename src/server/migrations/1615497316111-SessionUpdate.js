const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class SessionUpdate1615497316111 {
	name = "SessionUpdate1615497316111";

	async up(queryRunner) {
		await queryRunner.query(`COMMENT ON COLUMN "session"."expiredAt" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "expiredAt" SET DEFAULT '1615497322884'`
		);
		await queryRunner.query(`COMMENT ON COLUMN "session"."id" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "id" SET DEFAULT ''`
		);
		await queryRunner.query(`COMMENT ON COLUMN "session"."json" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "json" SET DEFAULT ''`
		);
	}

	async down(queryRunner) {
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "json" DROP DEFAULT`
		);
		await queryRunner.query(`COMMENT ON COLUMN "session"."json" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "id" DROP DEFAULT`
		);
		await queryRunner.query(`COMMENT ON COLUMN "session"."id" IS NULL`);
		await queryRunner.query(
			`ALTER TABLE "session" ALTER COLUMN "expiredAt" DROP DEFAULT`
		);
		await queryRunner.query(`COMMENT ON COLUMN "session"."expiredAt" IS NULL`);
	}
};
