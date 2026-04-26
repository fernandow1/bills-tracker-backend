/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Migrations1767309954609 {
  name = 'Migrations1767309954609';

  async up(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE \`bill_item\`
            ADD \`content_value\` decimal(10, 3) UNSIGNED NULL
        `);
    // Initialize content_value for existing records where net_unit is not 'u'
    // Set a default value of 1.0 for non-unit items
    await queryRunner.query(`
            UPDATE \`bill_item\`
            SET \`content_value\` = 1.0
            WHERE \`net_unit\` != 'u' AND \`content_value\` IS NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\`
            ADD \`id_user_owner\` int UNSIGNED NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\`
            ADD \`purchased_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill_item\` 
            ADD CONSTRAINT \`chk_net_unit_content_value_consistency\` 
            CHECK (
                (\`net_unit\` = 'u' AND \`content_value\` IS NULL) 
                OR 
                (\`net_unit\` != 'u' AND \`content_value\` IS NOT NULL)
            )
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
            ALTER TABLE \`bill_item\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill_item\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
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
            ALTER TABLE \`bill\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill_item\` 
            ADD CONSTRAINT \`chk_bill_item_quantity_positive\` 
            CHECK (\`quantity\` > 0)
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
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
            ALTER TABLE \`bill_item\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill_item\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
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
            ALTER TABLE \`user\` CHANGE \`deleted_at\` \`deleted_at\` timestamp(0) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\` DROP COLUMN \`purchased_at\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill\` DROP COLUMN \`id_user_owner\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill_item\` DROP COLUMN \`content_value\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill_item\` DROP CHECK \`chk_net_unit_content_value_consistency\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`bill_item\` DROP CHECK \`chk_bill_item_quantity_positive\`
        `);
  }
};
