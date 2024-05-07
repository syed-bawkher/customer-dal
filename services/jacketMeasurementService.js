import mysql from 'mysql2';
import dotenv from 'dotenv';
import { getOrderDate } from './orderService.js';


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

export async function getJacketMeasurementByOrderNo(orderNo) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`jacket_length`,`natural_length`,`back_length`,`x_back`,`half_shoulder`,`to_sleeve`,`chest`,`waist`,`collar`,`other_notes` FROM `JacketMeasurement` WHERE `orderNo` = ?", [orderNo]);
    const rows = result[0];
    return rows;
}

// Create initial Jacket Measurement
export async function createJacketMeasurement(data) {
    try {
        const orderDate = await getOrderDate(data.orderNo);
        const query = `
            INSERT INTO JacketMeasurement (customer_id, orderNo, date, jacket_length, natural_length, back_length, x_back, half_shoulder, to_sleeve, chest, waist, collar, other_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const [result] = await pool.query(query, [
            data.customer_id,
            data.orderNo,
            orderDate,
            data.jacket_length,
            data.natural_length,
            data.back_length,
            data.x_back,
            data.half_shoulder,
            data.to_sleeve,
            data.chest,
            data.waist,
            data.collar,
            data.other_notes
        ]);
        return result;
    } catch (error) {
        console.error('Failed to create jacket measurement:', error);
        throw error;
    }
}
