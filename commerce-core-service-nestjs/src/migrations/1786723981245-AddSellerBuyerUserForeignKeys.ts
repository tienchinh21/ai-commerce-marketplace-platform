import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSellerBuyerUserForeignKeys1786723981245 implements MigrationInterface {
    name = 'AddSellerBuyerUserForeignKeys1786723981245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marketplace"."sellers" ALTER COLUMN "metadata_json" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "marketplace"."buyers" ALTER COLUMN "metadata_json" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "marketplace"."product_variants" ALTER COLUMN "specs_json" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "marketplace"."products" ALTER COLUMN "specs_json" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "ingestion"."data_sources" ALTER COLUMN "config_json" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "ingestion"."sync_runs" ALTER COLUMN "metadata_json" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "marketplace"."sellers" ADD CONSTRAINT "FK_83f4670f0e114d0be3731bade87" FOREIGN KEY ("user_id") REFERENCES "identity"."external_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "marketplace"."buyers" ADD CONSTRAINT "FK_00d0563e17355f153e8a05fbc20" FOREIGN KEY ("user_id") REFERENCES "identity"."external_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marketplace"."buyers" DROP CONSTRAINT "FK_00d0563e17355f153e8a05fbc20"`);
        await queryRunner.query(`ALTER TABLE "marketplace"."sellers" DROP CONSTRAINT "FK_83f4670f0e114d0be3731bade87"`);
        await queryRunner.query(`ALTER TABLE "ingestion"."sync_runs" ALTER COLUMN "metadata_json" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "ingestion"."data_sources" ALTER COLUMN "config_json" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "marketplace"."products" ALTER COLUMN "specs_json" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "marketplace"."product_variants" ALTER COLUMN "specs_json" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "marketplace"."buyers" ALTER COLUMN "metadata_json" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "marketplace"."sellers" ALTER COLUMN "metadata_json" SET DEFAULT '{}'`);
    }

}
