import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTimestampsToUser1608683393993 implements MigrationInterface {
    name = 'AddTimestampsToUser1608683393993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `users` ADD `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `updated_at`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `created_at`");
    }

}
