/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Migrations1756673260575 {
    name = 'Migrations1756673260575'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`product\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
                \`id_brand\` int UNSIGNED NOT NULL,
                \`id_category\` int UNSIGNED NOT NULL,
                \`name\` varchar(255) COLLATE "utf8mb4_bin" NOT NULL,
                \`description\` tinytext NULL,
                \`net_price\` decimal(10, 2) NOT NULL,
                \`net_unit\` enum ('g', 'kg', 'l', 'ml', 'u') NOT NULL,
                \`quantity\` int UNSIGNED NOT NULL,
                \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
                \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`deleted_at\` timestamp(0) NULL,
                INDEX \`idx_product_id_category\` (\`id_category\`),
                INDEX \`idx_product_id_brand\` (\`id_brand\`),
                UNIQUE INDEX \`idx_product_name\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`brand_category\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`brand_category\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`brand\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`brand\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment_method\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment_method\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`deleted_at\` \`deleted_at\` timestamp(0) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`currency\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`currency\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\`
            ADD CONSTRAINT \`FK_31d111371fb2976c7a8e124fb23\` FOREIGN KEY (\`id_brand\`) REFERENCES \`brand\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\`
            ADD CONSTRAINT \`FK_728568cd9497499e160be34dddd\` FOREIGN KEY (\`id_category\`) REFERENCES \`category\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\`
            ADD CONSTRAINT \`FK_3e0e14707fab21dc0f205b971cc\` FOREIGN KEY (\`id_brand\`, \`id_category\`) REFERENCES \`brand_category\`(\`id_brand\`, \`id_category\`) ON DELETE RESTRICT ON UPDATE RESTRICT
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_3e0e14707fab21dc0f205b971cc\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_728568cd9497499e160be34dddd\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_31d111371fb2976c7a8e124fb23\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`currency\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`currency\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`deleted_at\` \`deleted_at\` timestamp(0) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment_method\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment_method\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`brand\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`brand\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`brand_category\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`brand_category\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            DROP INDEX \`idx_product_name\` ON \`product\`
        `);
        await queryRunner.query(`
            DROP INDEX \`idx_product_id_brand\` ON \`product\`
        `);
        await queryRunner.query(`
            DROP INDEX \`idx_product_id_category\` ON \`product\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product\`
        `);
    }
}
