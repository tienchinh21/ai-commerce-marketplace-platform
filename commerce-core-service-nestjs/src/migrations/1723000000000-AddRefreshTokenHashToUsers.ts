import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRefreshTokenHashToUsers1723000000000 implements MigrationInterface {
  name = 'AddRefreshTokenHashToUsers1723000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'identity.users',
      new TableColumn({
        name: 'refresh_token_hash',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('identity.users', 'refresh_token_hash');
  }
}
