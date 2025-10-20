import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLegalEntityFields1729427000000 implements MigrationInterface {
  name = 'AddLegalEntityFields1729427000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем колонки для юридических лиц в таблицу users
    
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'legalAddress',
        type: 'varchar',
        isNullable: true,
        comment: 'Юридический адрес для юридических лиц',
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'bankName',
        type: 'varchar',
        isNullable: true,
        comment: 'Название банка',
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'bankAccount',
        type: 'varchar',
        isNullable: true,
        comment: 'Расчетный счет',
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'bankCode',
        type: 'varchar',
        isNullable: true,
        comment: 'БИК банка',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем колонки при откате миграции
    await queryRunner.dropColumn('users', 'legalAddress');
    await queryRunner.dropColumn('users', 'bankName');
    await queryRunner.dropColumn('users', 'bankAccount');
    await queryRunner.dropColumn('users', 'bankCode');
  }
}

