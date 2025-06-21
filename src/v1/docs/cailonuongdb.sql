SET NAMES utf8mb4;
-- SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `stores`;
CREATE TABLE `stores`
(
    `id`            BIGINT UNSIGNED                       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name`          VARCHAR(100)                          NOT NULL UNIQUE,
    `phone`         VARCHAR(15)                           NULL,
    `address`       VARCHAR(255)                          NULL,
    `map_url`       VARCHAR(1024)                         NULL,
    `avatar_url`    VARCHAR(1024)                         NULL,
    `opening_hours` VARCHAR(100)                          NULL,
    `status`        ENUM ('active', 'inactive', 'closed') NOT NULL DEFAULT 'active',
    `created_at`    TIMESTAMP                                      DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP                                      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`status` IN ('active', 'inactive', 'closed')),
    INDEX `idx_name` (`name`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees`
(
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `nickname`   VARCHAR(50)                             NOT NULL UNIQUE,
    `email`      VARCHAR(100)                            NOT NULL UNIQUE,
    `name`       VARCHAR(100)                            NOT NULL,
    `phone`      VARCHAR(15)                             NULL UNIQUE,
    `position`   VARCHAR(100)                            NULL,
    `gender`     ENUM ('male', 'female', 'other')        NOT NULL DEFAULT 'other',
    `avatar_url` VARCHAR(1024)                           NULL,
    `store_id`   BIGINT UNSIGNED                         NULL,
    `status`     ENUM ('active', 'inactive', 'disabled') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP                                        DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP                                        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`status` IN ('active', 'inactive', 'disabled')),
    CHECK (`gender` IN ('male', 'female', 'other')),
    INDEX `idx_email` (`email`),
    INDEX `idx_store_id` (`store_id`),
    FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `employee_credentials`;
CREATE TABLE `employee_credentials`
(
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `employee_id`   BIGINT UNSIGNED NOT NULL UNIQUE,
    `key_hash`      VARCHAR(1024)   NOT NULL,
    `password_hash` VARCHAR(255)    NOT NULL,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_employee_id` (`employee_id`),
    FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `employee_keys`;
CREATE TABLE `employee_keys`
(
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `employee_id` BIGINT UNSIGNED NOT NULL UNIQUE,
    `public_key`  BINARY(64)      NOT NULL,
    `access_key`  BINARY(64)      NOT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_public_key` (`public_key`),
    FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `refresh_token_used_employees`;
CREATE TABLE `refresh_token_used_employees`
(
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `key_id`     BIGINT UNSIGNED NOT NULL,
    `token_hash` VARCHAR(1024)   NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_key_id` (`key_id`),
    FOREIGN KEY (`key_id`) REFERENCES `employee_keys` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers`
(
    `id`             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `nickname`       VARCHAR(50)                             NOT NULL UNIQUE,
    `name`           VARCHAR(100)                            NOT NULL,
    `gender`         ENUM ('male', 'female', 'other')        NULL     DEFAULT 'other',
    `avatar_url`     TEXT                                    NULL,
    `birthday`       DATE                                    NULL,
    `address`        VARCHAR(255)                            NULL,
    `loyalty_points` INT UNSIGNED                            NOT NULL DEFAULT 0,
    `email`          VARCHAR(100)                            NOT NULL UNIQUE,
    `phone`          VARCHAR(15)                             NULL UNIQUE,
    `status`         ENUM ('active', 'inactive', 'disabled') NOT NULL DEFAULT 'active',
    `created_at`     TIMESTAMP                                        DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     TIMESTAMP                                        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`status` IN ('active', 'inactive', 'disabled')),
    CHECK (`gender` IN ('male', 'female', 'other')),
    INDEX `idx_email` (`email`),
    INDEX `idx_phone` (`phone`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `customer_credentials`;
CREATE TABLE `customer_credentials`
(
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `customer_id`   BIGINT UNSIGNED NOT NULL UNIQUE,
    `key_hash`      VARCHAR(255)    NOT NULL,
    `password_hash` VARCHAR(255)    NOT NULL,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_customer_id` (`customer_id`),
    FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `customer_keys`;
CREATE TABLE `customer_keys`
(
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `customer_id` BIGINT UNSIGNED NOT NULL UNIQUE,
    `public_key`  BINARY(64)      NOT NULL,
    `access_key`  BINARY(64)      NOT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_public_key` (`public_key`),
    FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `refresh_token_used_customers`;
CREATE TABLE `refresh_token_used_customers`
(
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `key_id`     BIGINT UNSIGNED NOT NULL,
    `token_hash` VARCHAR(1024)   NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_key_id` (`key_id`),
    FOREIGN KEY (`key_id`) REFERENCES `customer_keys` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups`
(
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`        VARCHAR(50) NOT NULL UNIQUE,
    `description` TEXT        NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_name` (`name`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`
(
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `group_id`    BIGINT UNSIGNED NOT NULL,
    `name`        VARCHAR(50)     NOT NULL,
    `description` TEXT            NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_group_id` (`group_id`),
    UNIQUE KEY `uk_group_name` (`group_id`, `name`),
    FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `employee_groups`;
CREATE TABLE `employee_groups`
(
    `group_id`    BIGINT UNSIGNED NOT NULL,
    `employee_id` BIGINT UNSIGNED NOT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`group_id`, `employee_id`),
    FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_category_groups`;
CREATE TABLE `product_category_groups`
(
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`        VARCHAR(100)                NOT NULL UNIQUE,
    `slug`        VARCHAR(255)                NOT NULL UNIQUE,
    `description` TEXT                        NULL,
    `status`      ENUM ('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at`  TIMESTAMP                            DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP                            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`status` IN ('active', 'inactive')),
    INDEX `idx_slug` (`slug`),
    INDEX `idx_name` (`name`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_categories`;
CREATE TABLE `product_categories`
(
    `id`                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `category_group_id` BIGINT UNSIGNED             NOT NULL,
    `name`              VARCHAR(100)                NOT NULL UNIQUE,
    `slug`              VARCHAR(255)                NOT NULL UNIQUE,
    `description`       TEXT                        NULL,
    `status`            ENUM ('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at`        TIMESTAMP                            DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        TIMESTAMP                            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`status` IN ('active', 'inactive')),
    INDEX `idx_slug` (`slug`),
    INDEX `idx_name` (`name`),
    FOREIGN KEY (`category_group_id`) REFERENCES `product_category_groups` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_attributes`;
CREATE TABLE `product_attributes`
(
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`       VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_name` (`name`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_attribute_values`;
CREATE TABLE `product_attribute_values`
(
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `attribute_id`  BIGINT UNSIGNED NOT NULL,
    `value`         VARCHAR(100)    NOT NULL,
    `description`   TEXT            NULL,
    `default_price` DECIMAL(10, 2)  NOT NULL CHECK (`default_price` >= 0),
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_attribute_id` (`attribute_id`),
    FOREIGN KEY (`attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_properties`;
CREATE TABLE `product_properties`
(
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `property_key`  VARCHAR(100)                               NOT NULL UNIQUE COMMENT 'Khóa duy nhất của thuộc tính (VD: color, size, weight)',
    `property_name` VARCHAR(100)                               NOT NULL COMMENT 'Tên hiển thị (VD: Màu sắc, Kích thước, Trọng lượng)',
    `property_type` ENUM ('text', 'number', 'boolean', 'list') NOT NULL DEFAULT 'text' COMMENT 'Kiểu dữ liệu',
    `description`   TEXT                                       NULL COMMENT 'Mô tả chi tiết (nếu cần)',
    `created_at`    TIMESTAMP                                           DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP                                           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_property_key` (`property_key`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT = 'Bảng lưu trữ các đặc tính (properties) của sản phẩm';

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`
(
    `id`                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name_code`           VARCHAR(300)                                NOT NULL UNIQUE,
    `name`                VARCHAR(100)                                NOT NULL,
    `thumbnail_url`       VARCHAR(255)                                NULL,
    `description`         TEXT                                        NULL,
    `sku`                 VARCHAR(50)                                 NOT NULL UNIQUE,
    `barcode`             VARCHAR(50)                                 NULL UNIQUE,
    `slug`                VARCHAR(255)                                NOT NULL UNIQUE,
    `default_price`       DECIMAL(10, 2)                              NOT NULL CHECK (`default_price` >= 0),
    `currency`            VARCHAR(3)                                           DEFAULT 'VND',
    `category_id`         BIGINT UNSIGNED                             NOT NULL,
    `status`              ENUM ('active', 'inactive', 'discontinued') NOT NULL DEFAULT 'active',
    `is_favorite`         BOOLEAN                                     NOT NULL DEFAULT FALSE DEFAULT 0,
    `has_variant_pricing` BOOLEAN                                     NOT NULL DEFAULT FALSE,
    `created_at`          TIMESTAMP                                            DEFAULT CURRENT_TIMESTAMP,
    `updated_at`          TIMESTAMP                                            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`status` IN ('active', 'inactive', 'discontinued')),
    CHECK (`has_variant_pricing` IN (0, 1)),
    CHECK (`is_favorite` IN (0, 1)),
    INDEX `idx_name` (`name`),
    INDEX `idx_name_code` (`name_code`),
    INDEX `idx_slug` (`slug`),
    INDEX `idx_category_id` (`category_id`),
    INDEX `idx_sku` (`sku`),
    INDEX `idx_barcode` (`barcode`),
    FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE RESTRICT
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_property_assignments`;
CREATE TABLE `product_property_assignments`
(
    `product_id`     BIGINT UNSIGNED NOT NULL,
    `property_id`    BIGINT UNSIGNED NOT NULL COMMENT 'Reference to product_properties table',
    `property_value` TEXT            NOT NULL COMMENT 'Giá trị thuộc tính của sản phẩm',
    `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_property_id` (`property_id`),
    PRIMARY KEY (`product_id`, `property_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`property_id`) REFERENCES `product_properties` (`id`) ON DELETE RESTRICT
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT = 'Bảng liên kết giá trị thuộc tính với sản phẩm';

DROP TABLE IF EXISTS `product_attribute_assignments`;
CREATE TABLE `product_attribute_assignments`
(
    `product_id`         BIGINT UNSIGNED NOT NULL,
    `attribute_value_id` BIGINT UNSIGNED NOT NULL,
    `created_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`product_id`, `attribute_value_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`attribute_value_id`) REFERENCES `product_attribute_values` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images`
(
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `image_url`  VARCHAR(255)    NOT NULL,
    `alt_text`   VARCHAR(255)    NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_product_id` (`product_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `store_products`;
CREATE TABLE `store_products`
(
    `store_id`   BIGINT UNSIGNED             NOT NULL,
    `product_id` BIGINT UNSIGNED             NOT NULL,
    `status`     ENUM ('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP                            DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP                            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`store_id`, `product_id`),
    CHECK (`status` IN ('active', 'inactive')),
    FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `batches`;
CREATE TABLE `batches`
(
    `id`                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id`         BIGINT UNSIGNED                        NOT NULL,
    `store_id`           BIGINT UNSIGNED                        NOT NULL,
    `quantity`           INT UNSIGNED                           NOT NULL,
    `remaining_quantity` INT UNSIGNED                           NOT NULL,
    `cost_price`         DECIMAL(10, 2)                         NULL,
    `manufacture_date`   DATE                                   NOT NULL,
    `expiration_date`    DATE                                   NOT NULL,
    `note`               TEXT                                   NULL,
    `status`             ENUM ('active', 'inactive', 'expired') NOT NULL DEFAULT 'active',
    `created_by`         BIGINT UNSIGNED                        NOT NULL,
    `created_at`         TIMESTAMP                                       DEFAULT CURRENT_TIMESTAMP,
    `updated_at`         TIMESTAMP                                       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_store_id` (`store_id`),
    INDEX `idx_status` (`status`),
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`) ON DELETE RESTRICT,
    CHECK (`expiration_date` > `manufacture_date`),
    CHECK (`status` IN ('active', 'inactive', 'expired')),
    CHECK (`remaining_quantity` <= `quantity`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `inventory_transactions`;
CREATE TABLE `inventory_transactions`
(
    `id`               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `batch_id`         BIGINT UNSIGNED                                            NOT NULL,
    `transaction_type` ENUM ('import', 'sale', 'adjustment', 'return', 'expired') NOT NULL,
    `quantity`         INT UNSIGNED                                               NOT NULL,
    `note`             TEXT                                                       NULL,
    `created_by`       BIGINT UNSIGNED                                            NOT NULL,
    `created_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_batch_id` (`batch_id`),
    INDEX `idx_transaction_type` (`transaction_type`),
    INDEX `idx_created_by` (`created_by`),
    CHECK (`transaction_type` IN ('import', 'sale', 'adjustment', 'return', 'expired')),
    FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`) ON DELETE RESTRICT
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `sale_statuses`;
CREATE TABLE `sale_statuses`
(
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`        VARCHAR(30) NOT NULL UNIQUE,
    `description` TEXT        NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_name` (`name`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `vouchers`;
CREATE TABLE `vouchers`
(
    `id`                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `code`                VARCHAR(50)                            NOT NULL UNIQUE,
    `thumbnail_url`       BIGINT UNSIGNED                        NOT NULL,
    `description`         TEXT                                   NULL,
    `discount_type`       ENUM ('percent', 'fixed')              NOT NULL DEFAULT 'percent',
    `discount_value`      DECIMAL(10, 2)                         NOT NULL,
    `valid_from`          TIMESTAMP                              NOT NULL,
    `valid_to`            TIMESTAMP                              NOT NULL,
    `max_uses`            INT UNSIGNED                           NOT NULL DEFAULT 1,
    `min_purchase_amount` DECIMAL(10, 2)                         NOT NULL DEFAULT 0,
    `status`              ENUM ('active', 'inactive', 'expired') NOT NULL DEFAULT 'active',
    `count_used`          INT UNSIGNED                           NOT NULL DEFAULT 0,
    `created_by`          BIGINT UNSIGNED                        NOT NULL,
    `created_at`          TIMESTAMP                                       DEFAULT CURRENT_TIMESTAMP,
    `updated_at`          TIMESTAMP                                       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`status` IN ('active', 'inactive', 'expired')),
    CHECK (`discount_type` IN ('percent', 'fixed')),
    CHECK (`discount_value` >= 0),
    CHECK (`valid_from` < `valid_to`),
    CHECK (`max_uses` > 0),
    CHECK (`count_used` <= `max_uses`),
    CHECK (
        (`discount_type` = 'percent' AND `discount_value` <= 100) OR
        (`discount_type` = 'fixed' AND `discount_value` <= 1000000)
        ),
    INDEX `idx_code` (`code`),
    INDEX `idx_status_validity` (`status`, `valid_from`, `valid_to`),
    INDEX `idx_created_by` (`created_by`),
    FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`) ON DELETE RESTRICT
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `payment_methods`;
CREATE TABLE `payment_methods`
(
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`        VARCHAR(50)                 NOT NULL UNIQUE,
    `icon_url`    VARCHAR(255)                NULL,
    `configs`     TEXT                        NULL,
    `description` TEXT                        NULL,
    `status`      ENUM ('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at`  TIMESTAMP                            DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP                            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`status` IN ('active', 'inactive')),
    INDEX `idx_name` (`name`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales`
(
    `id`                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `store_id`          BIGINT UNSIGNED NOT NULL,
    `customer_id`       BIGINT UNSIGNED NULL,
    `staff_id`          BIGINT UNSIGNED NULL,
    `payment_method_id` BIGINT UNSIGNED NULL,
    `original_total`    DECIMAL(10, 2)  NOT NULL CHECK (`original_total` > 0),
    `discount_amount`   DECIMAL(10, 2)  NULL CHECK (`discount_amount` >= 0),
    `final_total`       DECIMAL(10, 2)  NOT NULL CHECK (`final_total` >= 0),
    `voucher_id`        BIGINT UNSIGNED NULL,
    `status_id`         BIGINT UNSIGNED NOT NULL,
    `note`              TEXT            NULL,
    `sale_date`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `created_at`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_store_id` (`store_id`),
    INDEX `idx_customer_id` (`customer_id`),
    INDEX `idx_staff_id` (`staff_id`),
    INDEX `idx_voucher_id` (`voucher_id`),
    INDEX `idx_status_id` (`status_id`),
    INDEX `idx_sale_date` (`sale_date`),
    FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`staff_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`status_id`) REFERENCES `sale_statuses` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE SET NULL,
    CHECK (`discount_amount` IS NULL OR `original_total` >= `discount_amount`),
    CHECK (`final_total` = COALESCE(`original_total` - `discount_amount`, `original_total`))
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
DROP TABLE IF EXISTS `sale_items`;
CREATE TABLE `sale_items`
(
    `sale_id`            BIGINT UNSIGNED NOT NULL,
    `product_id`         BIGINT UNSIGNED NOT NULL,
    `batch_id`           BIGINT UNSIGNED NOT NULL,
    `attribute_value_id` BIGINT UNSIGNED NOT NULL,
    `quantity`           INT UNSIGNED    NOT NULL CHECK (`quantity` > 0),
    `price`              DECIMAL(10, 2)  NOT NULL CHECK (`price` >= 0),
    `created_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`sale_id`, `product_id`, `batch_id`, `attribute_value_id`),
    INDEX `idx_sale_id` (`sale_id`),
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_batch_id` (`batch_id`),
    INDEX `idx_attribute_value_id` (`attribute_value_id`),
    FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`attribute_value_id`) REFERENCES `product_attribute_values` (`id`) ON DELETE RESTRICT
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `employee_vouchers`;
CREATE TABLE `employee_vouchers`
(
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `employee_id` BIGINT UNSIGNED                    NOT NULL,
    `voucher_id`  BIGINT UNSIGNED                    NOT NULL,
    `assigned_at` TIMESTAMP                                   DEFAULT CURRENT_TIMESTAMP,
    `used_at`     TIMESTAMP                          NULL,
    `status`      ENUM ('unused', 'used', 'expired') NOT NULL DEFAULT 'unused',
    `created_at`  TIMESTAMP                                   DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP                                   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_employee_id` (`employee_id`),
    INDEX `idx_voucher_id` (`voucher_id`),
    INDEX `idx_status` (`status`),
    CHECK (`status` IN ('unused', 'used', 'expired')),
    FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `refunds`;
CREATE TABLE `refunds`
(
    `id`                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `sale_id`           BIGINT UNSIGNED                                                               NOT NULL,
    `customer_id`       BIGINT UNSIGNED                                                               NULL,
    `staff_id`          BIGINT UNSIGNED                                                               NULL,
    `amount`            DECIMAL(10, 2)                                                                NOT NULL CHECK (`amount` > 0),
    `reason`            ENUM ('cancelled_by_customer', 'cancelled_by_staff', 'out_of_stock', 'other') NOT NULL,
    `note`              TEXT                                                                          NULL,
    `payment_method_id` BIGINT UNSIGNED                                                               NOT NULL,
    `created_by`        BIGINT UNSIGNED                                                               NOT NULL,
    `created_at`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_sale_id` (`sale_id`),
    INDEX `idx_customer_id` (`customer_id`),
    INDEX `idx_staff_id` (`staff_id`),
    INDEX `idx_payment_method_id` (`payment_method_id`),
    INDEX `idx_created_by` (`created_by`),
    CHECK (`reason` IN ('cancelled_by_customer', 'cancelled_by_staff', 'out_of_stock', 'other')),
    FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`staff_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`) ON DELETE RESTRICT
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `refund_requests`;
CREATE TABLE `refund_requests`
(
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `sale_id`      BIGINT UNSIGNED                                       NOT NULL,
    `customer_id`  BIGINT UNSIGNED                                       NULL,
    `amount`       DECIMAL(10, 2)                                        NOT NULL CHECK (`amount` > 0),
    `reason`       TEXT                                                  NOT NULL,
    `status`       ENUM ('pending', 'approved', 'rejected', 'completed') NOT NULL DEFAULT 'pending',
    `processed_by` BIGINT UNSIGNED                                       NULL,
    `processed_at` TIMESTAMP                                             NULL,
    `created_at`   TIMESTAMP                                                      DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP                                                      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_sale_id` (`sale_id`),
    INDEX `idx_customer_id` (`customer_id`),
    INDEX `idx_processed_by` (`processed_by`),
    INDEX `idx_status` (`status`),
    CHECK (`status` IN ('pending', 'approved', 'rejected', 'completed')),
    FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`processed_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts`
(
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `customer_id` BIGINT UNSIGNED                           NOT NULL,
    `status`      ENUM ('active', 'abandoned', 'converted') NOT NULL DEFAULT 'active',
    `created_at`  TIMESTAMP                                          DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP                                          DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (`status` IN ('active', 'abandoned', 'converted')),
    INDEX `idx_customer_id` (`customer_id`),
    FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER
      SET
      = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items`
(
    `id`                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `cart_id`            BIGINT UNSIGNED NOT NULL,
    `product_id`         BIGINT UNSIGNED NOT NULL,
    `attribute_value_id` BIGINT UNSIGNED NULL,
    `quantity`           INT UNSIGNED    NOT NULL CHECK (`quantity` > 0),
    `created_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_cart_id` (`cart_id`),
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_attribute_value_id` (`attribute_value_id`),
    UNIQUE KEY `uk_cart_product_attribute` (`cart_id`, `product_id`, `attribute_value_id`),
    FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`attribute_value_id`) REFERENCES `product_attribute_values` (`id`) ON DELETE SET NULL
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_reviews`;
CREATE TABLE `product_reviews`
(
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `sale_id`     BIGINT UNSIGNED  NOT NULL,
    `product_id`  BIGINT UNSIGNED  NOT NULL,
    `customer_id` BIGINT UNSIGNED  NOT NULL,
    `rating`      TINYINT UNSIGNED NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `content`     TEXT             NOT NULL,
    `image_url`   VARCHAR(255)     NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_sale_id` (`sale_id`),
    INDEX `idx_product_id` (`product_id`),
    INDEX `idx_customer_id` (`customer_id`),
    UNIQUE KEY `uk_sale_product` (`sale_id`, `product_id`, `customer_id`),
    FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;



SET FOREIGN_KEY_CHECKS = 1;
