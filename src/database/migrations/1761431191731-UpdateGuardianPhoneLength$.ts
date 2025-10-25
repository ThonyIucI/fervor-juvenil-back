import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGuardianPhoneLength$1761431191731 implements MigrationInterface {
    name = 'UpdateGuardianPhoneLength$1761431191731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "guardians" DROP COLUMN "phone"
        `);
        await queryRunner.query(`
            ALTER TABLE "guardians"
            ADD "phone" character varying(50)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "guardians" DROP COLUMN "phone"
        `);
        await queryRunner.query(`
            ALTER TABLE "guardians"
            ADD "phone" character varying(20)
        `);
    }

}
