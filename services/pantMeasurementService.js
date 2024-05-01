import mysql from 'mysql2';
import dotenv from 'dotenv';


dotenv.config();  // This should be at the top


const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

export async function getPantMeasurementByCustomerId(id) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`length`,`inseem`,`waist`,`hips`,`bottom`,`knee`,`other_notes` FROM `PantMeasurement` WHERE `customer_id` = ?;", [id])
    const rows = result[0];
    return rows;
}

export async function getPantMeasurementByOrderNo(orderNo) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`length`,`inseem`,`waist`,`hips`,`bottom`,`knee`,`other_notes` FROM `PantMeasurement` WHERE `orderNo` = ?", [orderNo]);
    const rows = result[0];
    return rows;
}