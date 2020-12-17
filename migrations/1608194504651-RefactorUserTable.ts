import {MigrationInterface, QueryRunner} from "typeorm";

export class RefactorUserTable1608194504651 implements MigrationInterface {
    name = 'RefactorUserTable1608194504651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users` (`email`)");
    }

}
