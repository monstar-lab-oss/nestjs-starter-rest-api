import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser1598821897370 implements MigrationInterface {
  name = 'UpdateUser1598821897370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` ADD `isActive` tinyint NOT NULL DEFAULT 1',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query('ALTER TABLE `users` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `id`');
    await queryRunner.query(
      'ALTER TABLE `users` ADD `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `id`');
    await queryRunner.query('ALTER TABLE `users` ADD `id` int NOT NULL');
    await queryRunner.query('ALTER TABLE `users` ADD PRIMARY KEY (`id`)');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `updatedAt`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `createdAt`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `isActive`');
  }
}
