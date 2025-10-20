import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUnpColumn1729426000000 implements MigrationInterface {
  name = 'AddUnpColumn1729426000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем колонку unp в таблицу users
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'unp',
        type: 'varchar',
        isNullable: true,
        comment: 'УНП (Учетный номер плательщика) для юридических лиц',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем колонку unp при откате миграции
    await queryRunner.dropColumn('users', 'unp');
  }
}

