CREATE TABLE `Customer` (
  `customer_id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(255),
  `middle_name` VARCHAR(255),
  `last_name` VARCHAR(255),
  `add1` VARCHAR(255),
  `add2` VARCHAR(255),
  `add3` VARCHAR(255),
  `add4` VARCHAR(255),
  `email` VARCHAR(255),
  `mobile` VARCHAR(255),
  `office_phone` VARCHAR(255),
  `residential_phone` VARCHAR(255),
  `last_ordered_date` DATE
);

CREATE TABLE `Orders` (
  `orderNo` VARCHAR(255) PRIMARY KEY,
  `customer_id` INT,
  `date` DATE,
  `onote` TEXT,
  FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`)
);

CREATE TABLE `JacketMeasurement` (
  `measurement_id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `customer_id` INT,
  `orderNo` VARCHAR(255),
  `date` DATE,
  `jacket_length` VARCHAR(255),
  `natural_length` VARCHAR(255),
  `back_length` VARCHAR(255),
  `x_back` VARCHAR(255),
  `half_shoulder` VARCHAR(255),
  `to_sleeve` VARCHAR(255),
  `chest` VARCHAR(255),
  `waist` VARCHAR(255),
  `collar` VARCHAR(255),
  `waist_coat_length` VARCHAR(255),
  `sherwani_length` VARCHAR(255),
  `other_notes` TEXT,
  FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`),
  FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`)
);

CREATE TABLE `FinalJacketMeasurement` (
  `measurement_id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `customer_id` INT,
  `orderNo` VARCHAR(255),
  `date` DATE,
  `jacket_length` VARCHAR(255),
  `natural_length` VARCHAR(255),
  `back_length` VARCHAR(255),
  `x_back` VARCHAR(255),
  `half_shoulder` VARCHAR(255),
  `to_sleeve` VARCHAR(255),
  `chest` VARCHAR(255),
  `waist` VARCHAR(255),
  `collar` VARCHAR(255),
  `waist_coat_length` VARCHAR(255),
  `sherwani_length` VARCHAR(255),
  `other_notes` TEXT,
  FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`),
  FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`)
);

CREATE TABLE `ShirtMeasurement` (
  `measurement_id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `customer_id` INT,
  `orderNo` VARCHAR(255),
  `date` DATE,
  `length` VARCHAR(255),
  `half_shoulder` VARCHAR(255),
  `to_sleeve` VARCHAR(255),
  `chest` VARCHAR(255),
  `waist` VARCHAR(255),
  `collar` VARCHAR(255),
  `other_notes` TEXT,
  FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`),
  FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`)
);

CREATE TABLE `FinalShirtMeasurement` (
  `measurement_id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `customer_id` INT,
  `orderNo` VARCHAR(255),
  `date` DATE,
  `length` VARCHAR(255),
  `half_shoulder` VARCHAR(255),
  `to_sleeve` VARCHAR(255),
  `chest` VARCHAR(255),
  `waist` VARCHAR(255),
  `collar` VARCHAR(255),
  `other_notes` TEXT,
  FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`),
  FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`)
);

CREATE TABLE `PantMeasurement` (
  `measurement_id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `customer_id` INT,
  `orderNo` VARCHAR(255),
  `date` DATE,
  `length` VARCHAR(255),
  `inseem` VARCHAR(255),
  `waist` VARCHAR(255),
  `hips` VARCHAR(255),
  `bottom` VARCHAR(255),
  `knee` VARCHAR(255),
  `other_notes` TEXT,
  FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`),
  FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`)
);

CREATE TABLE `FinalPantMeasurement` (
  `measurement_id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `customer_id` INT,
  `orderNo` VARCHAR(255),
  `date` DATE,
  `length` VARCHAR(255),
  `inseem` VARCHAR(255),
  `waist` VARCHAR(255),
  `hips` VARCHAR(255),
  `bottom` VARCHAR(255),
  `knee` VARCHAR(255),
  `other_notes` TEXT,
  FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`),
  FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`)
);

CREATE TABLE `Items` (
  `item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderNo` VARCHAR(255),
  `item_name` VARCHAR(255),
  `item_type` ENUM('shirt', 'jacket', 'pant'),
  `jacket_measurement_id` VARCHAR(36) NULL,
  `shirt_measurement_id` VARCHAR(36) NULL,
  `pant_measurement_id` VARCHAR(36) NULL,
  `final_jacket_measurement_id` VARCHAR(36) NULL,
  `final_shirt_measurement_id` VARCHAR(36) NULL,
  `final_pant_measurement_id` VARCHAR(36) NULL,
  `fabric_id` VARCHAR(255),
  `lining_fabric_id` VARCHAR(255),
  FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`),
  FOREIGN KEY (`jacket_measurement_id`) REFERENCES `JacketMeasurement`(`measurement_id`),
  FOREIGN KEY (`shirt_measurement_id`) REFERENCES `ShirtMeasurement`(`measurement_id`),
  FOREIGN KEY (`pant_measurement_id`) REFERENCES `PantMeasurement`(`measurement_id`),
  FOREIGN KEY (`final_jacket_measurement_id`) REFERENCES `FinalJacketMeasurement`(`measurement_id`),
  FOREIGN KEY (`final_shirt_measurement_id`) REFERENCES `FinalShirtMeasurement`(`measurement_id`),
  FOREIGN KEY (`final_pant_measurement_id`) REFERENCES `FinalPantMeasurement`(`measurement_id`),
  FOREIGN KEY (`fabric_id`) REFERENCES `Fabric`(`fabric_id`),
  FOREIGN KEY (`lining_fabric_id`) REFERENCES `Fabric`(`fabric_id`)
);

CREATE TABLE `Users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `OrderPhotos` (
  `photo_id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderNo` VARCHAR(255),
  `s3_key` VARCHAR(255),
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`)
);

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
