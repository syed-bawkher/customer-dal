-- Step 1: Create the Fabric table
CREATE TABLE `Fabric` (
  `fabric_id` VARCHAR(255) PRIMARY KEY,
  `fabric_code` VARCHAR(255),
  `fabric_name` VARCHAR(255),
  `fabric_location` VARCHAR(255),
  `fabric_length` VARCHAR(255),
  `fabric_supplier` VARCHAR(255),
  `fabric_brand` VARCHAR(255),
  `fabric_purchase_date` DATE,
  UNIQUE (`fabric_id`)
);

-- Step 2: Add fabric_id and lining_fabric_id to the Items table
ALTER TABLE `Items`
ADD COLUMN `fabric_id` VARCHAR(255),
ADD COLUMN `lining_fabric_id` VARCHAR(255);

-- Step 3: Add foreign key constraints to reference Fabric table
ALTER TABLE `Items`
ADD CONSTRAINT `fk_fabric_id` FOREIGN KEY (`fabric_id`) REFERENCES `Fabric`(`fabric_id`),
ADD CONSTRAINT `fk_lining_fabric_id` FOREIGN KEY (`lining_fabric_id`) REFERENCES `Fabric`(`fabric_id`);

-- Step 4: Remove fabric_name and lining_name from the Items table
ALTER TABLE `Items`
DROP COLUMN `fabric_name`,
DROP COLUMN `lining_name`;
