import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateArticles1612590521475 implements MigrationInterface {
    name = 'CreateArticles1612590521475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `articles` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `post` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `authorId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `articles` ADD CONSTRAINT `FK_65d9ccc1b02f4d904e90bd76a34` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `articles` DROP FOREIGN KEY `FK_65d9ccc1b02f4d904e90bd76a34`");
        await queryRunner.query("DROP TABLE `articles`");
    }

}
