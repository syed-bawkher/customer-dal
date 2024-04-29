-- Drop tables if they exist, starting with those having foreign keys
SET foreign_key_checks = 0;
DROP TABLE IF EXISTS Pant;
DROP TABLE IF EXISTS PantMeasurement;
DROP TABLE IF EXISTS Shirt;
DROP TABLE IF EXISTS ShirtMeasurement;
DROP TABLE IF EXISTS Jacket;
DROP TABLE IF EXISTS JacketMeasurement;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Customer;
SET foreign_key_checks = 1;
