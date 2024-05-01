import mysql from 'mysql2';
import dotenv from 'dotenv';


dotenv.config();  // This should be at the top


const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

export async function getJacketMeasurementByCustomerId(id) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`jacket_length`,`natural_length`,`back_length`,`x_back`,`half_shoulder`,`to_sleeve`,`chest`,`waist`,`collar`,`other_notes` FROM `JacketMeasurement` WHERE `customer_id` = ?", [id])
    const rows = result[0];
    return rows;
}