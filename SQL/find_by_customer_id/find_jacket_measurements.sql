 SELECT 
    `measurement_id`,
    `date`,
    `jacket_length`,
    `natural_length`,
    `back_length`,
    `x_back`,
    `half_shoulder`,
    `to_sleeve`,
    `chest`,
    `waist`,
    `collar`,
    `other_notes`
FROM `JacketMeasurement`
WHERE `customer_id` = 20521;
