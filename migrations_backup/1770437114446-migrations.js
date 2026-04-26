/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Migrations1770437114446 {
  name = 'Migrations1770437114446';

  async up(queryRunner) {
    // await queryRunner.query(`
    //     DROP INDEX \`idx_shop_location\` ON \`shop\`
    // `);
    // await queryRunner.query(`
    //     DROP INDEX \`idx_bill_user_owner\` ON \`bill\`
    // `);
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`role\` enum ('admin', 'user', 'guest') NOT NULL DEFAULT 'guest'
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
            ALTER TABLE \`product\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`product\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
    // await queryRunner.query(`
    //     CREATE INDEX \`idx_shop_location\` ON \`shop\` (\`latitude\`)
    // `);
    // await queryRunner.query(`
    //     CREATE INDEX \`idx_shop_location\` ON \`shop\` (\`longitude\`)
    // `);
    // await queryRunner.query(`
    //         CREATE INDEX \`idx_shop_location\` ON \`shop\` (\`latitude\`, \`longitude\`)
    //     `);
  }

  async down(queryRunner) {
    // await queryRunner.query(`
    //     DROP INDEX \`idx_shop_location\` ON \`shop\`
    // `);
    // await queryRunner.query(`
    //     DROP INDEX \`idx_shop_location\` ON \`shop\`
    // `);
    // await queryRunner.query(`
    //     DROP INDEX \`idx_shop_location\` ON \`shop\`
    // `);
    await queryRunner.query(`
            ALTER TABLE \`product\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`product\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
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
            ALTER TABLE \`user\` DROP COLUMN \`role\`
        `);
    // await queryRunner.query(`
    //     CREATE INDEX \`idx_bill_user_owner\` ON \`bill\` (\`id_user_owner\`)
    // `);
    // await queryRunner.query(`
    //     CREATE INDEX \`idx_shop_location\` ON \`shop\` (\`latitude\`, \`longitude\`)
    // `);
  }
};
