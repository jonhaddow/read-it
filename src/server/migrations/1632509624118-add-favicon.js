const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class addFavicon1632509624118 {
	name = "addFavicon1632509624118";

	async up(queryRunner) {
		await queryRunner.query(
			`ALTER TABLE "bookmark" ADD "favicon" character varying`
		);
	}

	async down(queryRunner) {
		await queryRunner.query(`ALTER TABLE "bookmark" DROP COLUMN "favicon"`);
	}
};
