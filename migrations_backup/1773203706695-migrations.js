/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Migrations1773203706695 {
  name = 'Migrations1773203706695';

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE \`product_alias\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
                \`id_product\` int UNSIGNED NOT NULL,
                \`id_shop\` int UNSIGNED NOT NULL,
                \`alias_name\` varchar(255) NOT NULL,
                UNIQUE INDEX \`uq_shop_alias\` (\`id_shop\`, \`alias_name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
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
            ALTER TABLE \`product\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`product\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`currency\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`currency\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
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
            ALTER TABLE \`bill\` CHANGE \`purchased_at\` \`purchased_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill_item\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill_item\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_alias\`
            ADD CONSTRAINT \`FK_62894c349fb1d65793f545dfbcb\` FOREIGN KEY (\`id_product\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_alias\`
            ADD CONSTRAINT \`FK_d8fda1ebcff1a571f0c2601d1ed\` FOREIGN KEY (\`id_shop\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE \`product_alias\` DROP FOREIGN KEY \`FK_d8fda1ebcff1a571f0c2601d1ed\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`product_alias\` DROP FOREIGN KEY \`FK_62894c349fb1d65793f545dfbcb\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill_item\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill_item\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\` CHANGE \`purchased_at\` \`purchased_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
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
            ALTER TABLE \`currency\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`currency\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`product\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`product\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
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
            DROP INDEX \`uq_shop_alias\` ON \`product_alias\`
        `);
    await queryRunner.query(`
            DROP TABLE \`product_alias\`
        `);
  }
};
