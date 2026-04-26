/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Migrations1756068538234 {
    name = 'Migrations1756068538234'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`category\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
                \`name\` varchar(100) COLLATE "utf8mb4_bin" NOT NULL,
                \`description\` tinytext NULL,
                \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
                \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`deleted_at\` timestamp(0) NULL,
                UNIQUE INDEX \`idx_category_name\` (\`name\`),
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
    }

    async down(queryRunner) {
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
            ALTER TABLE \`shop\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`shop\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            DROP INDEX \`idx_category_name\` ON \`category\`
        `);
        await queryRunner.query(`
            DROP TABLE \`category\`
        `);
    }
}
