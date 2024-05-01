SELECT 
    `measurement_id`,
    `date`,
    `orderNo`,
    `length`,
    `half_shoulder`,
    `to_sleeve`,
    `chest`,
    `waist`,
    `collar`,
    `waist_coat_length`,
    `sherwani_length`,
    `other_notes`
FROM `ShirtMeasurement`
WHERE `customer_id` = 20521;
