/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Migrations1758211332977 {
  name = 'Migrations1758211332977';

  async up(queryRunner) {
    await queryRunner.query(`
            DROP INDEX \`IDX_f0640e30fef1d175426d80dbc1\` ON \`shop\`
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
            ALTER TABLE \`payment_method\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`payment_method\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`currency\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            ALTER TABLE \`currency\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX \`uq_bill_item\` ON \`bill_item\` (\`id_bill\`, \`id_product\`)
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            DROP INDEX \`uq_bill_item\` ON \`bill_item\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`currency\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`currency\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`payment_method\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE \`payment_method\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
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
            CREATE UNIQUE INDEX \`IDX_f0640e30fef1d175426d80dbc1\` ON \`shop\` (\`name\`)
        `);
  }
};
