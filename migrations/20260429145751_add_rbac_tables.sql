-- Create "permission" table
CREATE TABLE `permission` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `action` varchar(50) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `description` tinytext NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_permission_action_subject` (`action`, `subject`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "role" table
CREATE TABLE `role` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` tinytext NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_role_name` (`name`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "role_permission" table
CREATE TABLE `role_permission` (
  `id_role` int unsigned NOT NULL,
  `id_permission` int unsigned NOT NULL,
  PRIMARY KEY (`id_role`, `id_permission`),
  INDEX `IDX_0f35e0a93838653f6897b4a027` (`id_permission`),
  INDEX `IDX_138a98e6fa0df562f107835eb4` (`id_role`),
  CONSTRAINT `FK_0f35e0a93838653f6897b4a0274` FOREIGN KEY (`id_permission`) REFERENCES `permission` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT `FK_138a98e6fa0df562f107835eb49` FOREIGN KEY (`id_role`) REFERENCES `role` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Modify "user" table
-- 1. Add the new column (nullable initially)
ALTER TABLE `user` ADD COLUMN `id_role` int unsigned NULL;

-- 2. Insert default roles so we can reference them for existing users
INSERT INTO `role` (`name`, `description`) VALUES
  ('admin', 'Administrator role'),
  ('user', 'Standard user role'),
  ('guest', 'Guest role');

-- 3. Map existing data from the enum to the new foreign key
UPDATE `user` u 
JOIN `role` r ON u.`role` = r.`name`
SET u.`id_role` = r.`id`;

-- 4. Fallback for any edge case (set to guest if null)
UPDATE `user` SET `id_role` = (SELECT `id` FROM `role` WHERE `name` = 'guest') WHERE `id_role` IS NULL;

-- 5. Make the new column NOT NULL, add the index, constraint, and drop the old column
ALTER TABLE `user` 
  MODIFY COLUMN `id_role` int unsigned NOT NULL,
  ADD INDEX `FK_1a3abee4bf37fa00ebd698cedec` (`id_role`), 
  ADD CONSTRAINT `FK_1a3abee4bf37fa00ebd698cedec` FOREIGN KEY (`id_role`) REFERENCES `role` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  DROP COLUMN `role`;
