import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddRolesProfilesGuardians1761387822949 implements MigrationInterface {
  name = 'AddRolesProfilesGuardians1761387822949'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "user_profiles" ("uuid" uuid NOT NULL, "registration_date" TIMESTAMP, "last_names" character varying(120), "first_names" character varying(120), "gender" character varying(10), "age" smallint, "birth_date" date, "status" character varying(10), "alias" character varying(80), "has_uniform" boolean, "shirt_size" character varying(5), "pants_size" character varying(5), "shoe_size" character varying(5), "height_meters" numeric(4,2), "weight_kg" numeric(5,2), "health_insurance" character varying(50), "blood_type" character varying(5), "allergies" text, "disability_or_disorder" text, "enrollment_date" date, "current_residence" character varying(120), "professional_goal" character varying(120), "favorite_hero" character varying(120), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_uuid" uuid, CONSTRAINT "REL_ee854dde927907a51a79860011" UNIQUE ("user_uuid"), CONSTRAINT "PK_040865f172e05ac6714fc915b60" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE TABLE "roles" ("uuid" uuid NOT NULL, "name" character varying(50) NOT NULL, "description" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_cdc7776894e484eaed828ca0616" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE TABLE "user_roles" ("uuid" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_uuid" uuid, "role_uuid" uuid, CONSTRAINT "PK_d60df0e0fc8413e406f54da4df8" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE TABLE "guardians" ("uuid" uuid NOT NULL, "full_name" character varying(120) NOT NULL, "phone" character varying(20), "email" character varying(120), "contact_type" character varying(50), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_uuid" uuid, CONSTRAINT "PK_923a56a52de77fc023248b36724" PRIMARY KEY ("uuid"))')
    await queryRunner.query('ALTER TABLE "users" ADD "dni" character varying(20)')
    await queryRunner.query('ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true')
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "uuid" DROP DEFAULT')
    await queryRunner.query('ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"')
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "email"')
    await queryRunner.query('ALTER TABLE "users" ADD "email" character varying(150)')
    await queryRunner.query('ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")')
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "password" TYPE character varying(255)')
    await queryRunner.query('ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_ee854dde927907a51a798600119" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "user_roles" ADD CONSTRAINT "FK_2ebc2e1e2cb1d730d018893daef" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "user_roles" ADD CONSTRAINT "FK_0ea82c7b2302d7af0f8b789d797" FOREIGN KEY ("role_uuid") REFERENCES "roles"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "guardians" ADD CONSTRAINT "FK_6d2b3e4856f9892d3163dbb44bc" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "guardians" DROP CONSTRAINT "FK_6d2b3e4856f9892d3163dbb44bc"')
    await queryRunner.query('ALTER TABLE "user_roles" DROP CONSTRAINT "FK_0ea82c7b2302d7af0f8b789d797"')
    await queryRunner.query('ALTER TABLE "user_roles" DROP CONSTRAINT "FK_2ebc2e1e2cb1d730d018893daef"')
    await queryRunner.query('ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_ee854dde927907a51a798600119"')
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "password"')
    await queryRunner.query('ALTER TABLE "users" ADD "password" character varying NOT NULL')
    await queryRunner.query('ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"')
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "email"')
    await queryRunner.query('ALTER TABLE "users" ADD "email" character varying')
    await queryRunner.query('ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")')
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "uuid" SET DEFAULT uuid_generate_v4()')
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "is_active"')
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "dni"')
    await queryRunner.query('DROP TABLE "guardians"')
    await queryRunner.query('DROP TABLE "user_roles"')
    await queryRunner.query('DROP TABLE "roles"')
    await queryRunner.query('DROP TABLE "user_profiles"')
  }
}
