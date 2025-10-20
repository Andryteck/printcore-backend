import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserTypeColumn1729425600000 implements MigrationInterface {
  name = 'AddUserTypeColumn1729425600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем колонку userType в таблицу users
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'userType',
        type: 'varchar',
        default: "'individual'",
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем колонку userType при откате миграции
    await queryRunner.dropColumn('users', 'userType');
  }
}

