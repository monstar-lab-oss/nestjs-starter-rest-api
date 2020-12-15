import {MigrationInterface, QueryRunner} from "typeorm";

export class RefactorUserTable1607946140933 implements MigrationInterface {
    name = 'RefactorUserTable1607946140933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_fe0bb3f6520ee0469504521e71` ON `users`");
        await queryRunner.query("ALTER TABLE `users` ADD `roles` text NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `roles`");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_fe0bb3f6520ee0469504521e71` ON `users` (`username`)");
    }

}
