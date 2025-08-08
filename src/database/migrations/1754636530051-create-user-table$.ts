import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable$1754636530051 implements MigrationInterface {
  name = 'CreateUserTable$1754636530051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`uuid\` varchar(36) NOT NULL,
                \`slug\` varchar(255) NOT NULL,
                \`first_name\` varchar(255) NOT NULL,
                \`last_name\` varchar(255) NOT NULL,
                \`email\` varchar(255) NULL,
                \`password\` varchar(255) NOT NULL,
                \`is_google_account\` tinyint NOT NULL DEFAULT 0,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`uuid\`)
            ) ENGINE = InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
    await queryRunner.query(`
            DROP TABLE \`users\`
        `);
  }
}
