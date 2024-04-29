CREATE TABLE `Customer` (
  `customer_id` INT PRIMARY KEY,
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
  FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`customer_id`)
);

CREATE TABLE `JacketMeasurement` (
  `measurement_id` VARCHAR(255) PRIMARY KEY,
  `customer_id` INT,
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
  `other_notes` TEXT,
  FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`customer_id`)
);

CREATE TABLE `ShirtMeasurement` (
  `measurement_id` VARCHAR(255) PRIMARY KEY,
  `customer_id` INT,
  `date` DATE,
  `length` VARCHAR(255),
  `half_shoulder` VARCHAR(255),
  `to_sleeve` VARCHAR(255),
  `chest` VARCHAR(255),
  `waist` VARCHAR(255),
  `collar` VARCHAR(255),
  `waist_coat_length` VARCHAR(255),
  `sherwani_length` VARCHAR(255),
  `other_notes` TEXT,
  FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`customer_id`)
);

CREATE TABLE `PantMeasurement` (
  `measurement_id` VARCHAR(255) PRIMARY KEY,
  `customer_id` INT,
  `date` DATE,
  `length` VARCHAR(255),
  `inseem` VARCHAR(255),
  `waist` VARCHAR(255),
  `hips` VARCHAR(255),
  `bottom` VARCHAR(255),
  `knee` VARCHAR(255),
  `other_notes` TEXT,
  FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`customer_id`)
);
