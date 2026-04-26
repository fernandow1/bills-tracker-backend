-- Create "user" table
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL COLLATE utf8mb4_bin,
  `password` varchar(255) NOT NULL COLLATE utf8mb4_bin,
  `role` enum('admin','user','guest') NOT NULL DEFAULT "guest",
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_user_email` (`email`),
  UNIQUE INDEX `idx_user_username` (`username`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "payment_method" table
CREATE TABLE `payment_method` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `uuid` binary(16) NULL,
  `name` varchar(150) NOT NULL,
  `description` tinytext NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `IDX_6101666760258a840e115e1bb1` (`name`),
  UNIQUE INDEX `IDX_8aa6ca0f30ddb213477a2bb577` (`uuid`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "currency" table
CREATE TABLE `currency` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `symbol` varchar(10) NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "shop" table
CREATE TABLE `shop` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COLLATE utf8mb4_bin,
  `description` tinytext NULL,
  `latitude` double NULL,
  `longitude` double NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_shop_location` (`latitude`, `longitude`),
  UNIQUE INDEX `idx_shop_name` (`name`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "bill" table
CREATE TABLE `bill` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_shop` int unsigned NOT NULL,
  `id_currency` int unsigned NOT NULL,
  `id_payment_method` int unsigned NOT NULL,
  `id_user` int unsigned NOT NULL,
  `sub_total` decimal(10,2) unsigned NOT NULL,
  `discount` decimal(10,2) unsigned NULL DEFAULT 0.00,
  `total` decimal(10,2) unsigned NOT NULL,
  `id_user_owner` int unsigned NOT NULL,
  `purchased_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `receipt_number` varchar(150) NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_6498532ac094ed754c680d064e1` (`id_user`),
  INDEX `FK_87e0b890c4ccf72cb88ec640143` (`id_user_owner`),
  INDEX `FK_9c67ad9818955c307ef0445cf30` (`id_payment_method`),
  INDEX `FK_a6eea9ed9093e3f38e9a4f0ed27` (`id_currency`),
  INDEX `FK_add5b4308af421093b156a5afe8` (`id_shop`),
  CONSTRAINT `FK_6498532ac094ed754c680d064e1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `FK_87e0b890c4ccf72cb88ec640143` FOREIGN KEY (`id_user_owner`) REFERENCES `user` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `FK_9c67ad9818955c307ef0445cf30` FOREIGN KEY (`id_payment_method`) REFERENCES `payment_method` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT `FK_a6eea9ed9093e3f38e9a4f0ed27` FOREIGN KEY (`id_currency`) REFERENCES `currency` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT `FK_add5b4308af421093b156a5afe8` FOREIGN KEY (`id_shop`) REFERENCES `shop` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "brand" table
CREATE TABLE `brand` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COLLATE utf8mb4_bin,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_brand_name` (`name`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "category" table
CREATE TABLE `category` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COLLATE utf8mb4_bin,
  `description` tinytext NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_category_name` (`name`)
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "brand_category" table
CREATE TABLE `brand_category` (
  `id_brand` int unsigned NOT NULL,
  `id_category` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id_brand`, `id_category`),
  INDEX `FK_1e9aee9ce30ccc28da157f34b40` (`id_category`),
  CONSTRAINT `FK_1e9aee9ce30ccc28da157f34b40` FOREIGN KEY (`id_category`) REFERENCES `category` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `FK_3182397f713e52ec980960d34c7` FOREIGN KEY (`id_brand`) REFERENCES `brand` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "product" table
CREATE TABLE `product` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_brand` int unsigned NOT NULL,
  `id_category` int unsigned NOT NULL,
  `name` varchar(255) NOT NULL COLLATE utf8mb4_bin,
  `description` tinytext NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_3e0e14707fab21dc0f205b971cc` (`id_brand`, `id_category`),
  INDEX `idx_product_id_brand` (`id_brand`),
  INDEX `idx_product_id_category` (`id_category`),
  UNIQUE INDEX `idx_product_name` (`name`),
  CONSTRAINT `FK_31d111371fb2976c7a8e124fb23` FOREIGN KEY (`id_brand`) REFERENCES `brand` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_3e0e14707fab21dc0f205b971cc` FOREIGN KEY (`id_brand`, `id_category`) REFERENCES `brand_category` (`id_brand`, `id_category`) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_728568cd9497499e160be34dddd` FOREIGN KEY (`id_category`) REFERENCES `category` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "bill_item" table
CREATE TABLE `bill_item` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_bill` int unsigned NOT NULL,
  `id_product` int unsigned NOT NULL,
  `quantity` int unsigned NOT NULL,
  `content_value` decimal(10,3) unsigned NULL,
  `net_price` decimal(10,2) unsigned NOT NULL,
  `net_unit` enum('g','kg','l','ml','u') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_bill_item_product_price` (`id_product`, `net_price`, `id_bill`),
  UNIQUE INDEX `uq_bill_item` (`id_bill`, `id_product`),
  CONSTRAINT `FK_5bb406e0e449fb2663af14e207a` FOREIGN KEY (`id_bill`) REFERENCES `bill` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `FK_99d84132c2b10635533d58c9a77` FOREIGN KEY (`id_product`) REFERENCES `product` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Create "product_alias" table
CREATE TABLE `product_alias` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_product` int unsigned NOT NULL,
  `id_shop` int unsigned NOT NULL,
  `alias_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_62894c349fb1d65793f545dfbcb` (`id_product`),
  UNIQUE INDEX `uq_shop_alias` (`id_shop`, `alias_name`),
  CONSTRAINT `FK_62894c349fb1d65793f545dfbcb` FOREIGN KEY (`id_product`) REFERENCES `product` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT `FK_d8fda1ebcff1a571f0c2601d1ed` FOREIGN KEY (`id_shop`) REFERENCES `shop` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
