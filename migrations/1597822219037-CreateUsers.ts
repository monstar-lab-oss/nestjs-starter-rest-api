import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsers1597822219037 implements MigrationInterface {
    name = 'CreateUsers1597822219037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `password` varchar(255) NOT NULL, `email` varchar(200) NOT NULL, UNIQUE INDEX `email` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `email` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
    }

}
