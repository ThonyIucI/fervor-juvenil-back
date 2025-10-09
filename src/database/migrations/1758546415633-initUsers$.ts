import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitUsers$1758546415633 implements MigrationInterface {
  name = 'InitUsers$1758546415633'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "slug" character varying NOT NULL,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "email" character varying,
                "password" character varying NOT NULL,
                "is_google_account" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1" PRIMARY KEY ("uuid")
            )
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "users"
        `)
  }
}
