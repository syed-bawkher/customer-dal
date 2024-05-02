SELECT * FROM Customer
WHERE CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', IFNULL(last_name, '')) LIKE '%9003222949%'
OR mobile = '9003222949'
OR office_phone = '9003222949'
OR residential_phone = '9003222949';