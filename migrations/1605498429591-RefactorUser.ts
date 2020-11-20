import {MigrationInterface, QueryRunner} from "typeorm";

export class RefactorUser1605498429591 implements MigrationInterface {
    name = 'RefactorUser1605498429591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `email` ON `users`");
        await queryRunner.query("ALTER TABLE `users` CHANGE `email` `username` varchar(200) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` ADD UNIQUE INDEX `IDX_fe0bb3f6520ee0469504521e71` (`username`)");
        await queryRunner.query("CREATE UNIQUE INDEX `username` ON `users` (`username`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `username` ON `users`");
        await queryRunner.query("ALTER TABLE `users` DROP INDEX `IDX_fe0bb3f6520ee0469504521e71`");
        await queryRunner.query("ALTER TABLE `users` CHANGE `username` `email` varchar(200) NOT NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `email` ON `users` (`email`)");
    }

}
