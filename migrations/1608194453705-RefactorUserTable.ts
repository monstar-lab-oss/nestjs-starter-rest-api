import {MigrationInterface, QueryRunner} from "typeorm";

export class RefactorUserTable1608194453705 implements MigrationInterface {
    name = 'RefactorUserTable1608194453705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `isAccountDisabled` tinyint NOT NULL");
        await queryRunner.query("ALTER TABLE `users` ADD `email` varchar(200) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` ADD UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`)");
        await queryRunner.query("CREATE UNIQUE INDEX `email` ON `users` (`email`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `email` ON `users`");
        await queryRunner.query("ALTER TABLE `users` DROP INDEX `IDX_97672ac88f789774dd47f7c8be`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `email`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `isAccountDisabled`");
    }

}
