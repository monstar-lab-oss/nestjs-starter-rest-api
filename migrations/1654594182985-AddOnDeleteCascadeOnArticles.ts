import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOnDeleteCascadeOnArticles1654594182985 implements MigrationInterface {
    name = 'AddOnDeleteCascadeOnArticles1654594182985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`example_db\`.\`articles\` DROP FOREIGN KEY \`FK_65d9ccc1b02f4d904e90bd76a34\``);
        await queryRunner.query(`ALTER TABLE \`example_db\`.\`users\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`example_db\`.\`articles\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`example_db\`.\`articles\` ADD CONSTRAINT \`FK_65d9ccc1b02f4d904e90bd76a34\` FOREIGN KEY (\`authorId\`) REFERENCES \`example_db\`.\`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`example_db\`.\`articles\` DROP FOREIGN KEY \`FK_65d9ccc1b02f4d904e90bd76a34\``);
        await queryRunner.query(`ALTER TABLE \`example_db\`.\`articles\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`example_db\`.\`users\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`example_db\`.\`articles\` ADD CONSTRAINT \`FK_65d9ccc1b02f4d904e90bd76a34\` FOREIGN KEY (\`authorId\`) REFERENCES \`example_db\`.\`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
