SELECT 
    `measurement_id`,
    `date`,
    `length`,
    `inseem`,
    `waist`,
    `hips`,
    `bottom`,
    `knee`,
    `other_notes`
FROM `PantMeasurement`
WHERE `customer_id` = 20521;
