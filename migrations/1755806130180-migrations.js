/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Migrations1755806130180 {
    name = 'Migrations1755806130180'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`shop\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`description\` tinytext NOT NULL,
                \`latitude\` double(9, 6) NULL,
                \`longitude\` double(9, 6) NULL,
                \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
                \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`deleted_at\` timestamp(0) NULL,
                INDEX \`idx_shop_name\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`brand\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
                \`name\` varchar(50) COLLATE "utf8mb4_bin" NOT NULL,
                \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
                \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`deleted_at\` timestamp(0) NULL,
                UNIQUE INDEX \`idx_brand_name\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`payment_method\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
                \`name\` varchar(150) NOT NULL,
                \`description\` tinytext NULL,
                \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
                \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`deleted_at\` timestamp(0) NULL,
                UNIQUE INDEX \`IDX_6101666760258a840e115e1bb1\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`currency\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
                \`code\` varchar(10) NOT NULL,
                \`name\` varchar(100) NOT NULL,
                \`symbol\` varchar(10) NULL,
                \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
                \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`deleted_at\` timestamp(0) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
                \`name\` varchar(100) NOT NULL,
                \`surname\` varchar(100) NULL,
                \`email\` varchar(100) NOT NULL,
                \`username\` varchar(100) COLLATE "utf8mb4_bin" NOT NULL,
                \`password\` varchar(255) COLLATE "utf8mb4_bin" NOT NULL,
                \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
                \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`deleted_at\` timestamp(0) NULL,
                UNIQUE INDEX \`idx_user_username\` (\`username\`),
                UNIQUE INDEX \`idx_user_email\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP INDEX \`idx_user_email\` ON \`user\`
        `);
        await queryRunner.query(`
            DROP INDEX \`idx_user_username\` ON \`user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`currency\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_6101666760258a840e115e1bb1\` ON \`payment_method\`
        `);
        await queryRunner.query(`
            DROP TABLE \`payment_method\`
        `);
        await queryRunner.query(`
            DROP INDEX \`idx_brand_name\` ON \`brand\`
        `);
        await queryRunner.query(`
            DROP TABLE \`brand\`
        `);
        await queryRunner.query(`
            DROP INDEX \`idx_shop_name\` ON \`shop\`
        `);
        await queryRunner.query(`
            DROP TABLE \`shop\`
        `);
    }
}
