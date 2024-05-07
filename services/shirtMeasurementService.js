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

export async function getShirtMeasurementByCustomerId(id) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`length`,`half_shoulder`,`to_sleeve`,`chest`,`waist`,`collar`,`waist_coat_length`,`sherwani_length`,`other_notes` FROM `ShirtMeasurement` WHERE `customer_id` = ?", [id])
    const rows = result[0];
    return rows;
}

export async function getShirtMeasurementByOrderNo(orderNo) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`length`,`half_shoulder`,`to_sleeve`,`chest`,`waist`,`collar`,`waist_coat_length`,`sherwani_length`,`other_notes` FROM `ShirtMeasurement` WHERE `orderNo` = ?", [orderNo]);
    const rows = result[0];
    return rows;
}

// Create initial Shirt Measurement
export async function createShirtMeasurement(data) {
    try {
        const orderDate = await getOrderDate(data.orderNo);
        const query = `
            INSERT INTO ShirtMeasurement (customer_id, orderNo, date, length, half_shoulder, to_sleeve, chest, waist, collar, waist_coat_length, sherwani_length, other_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const [result] = await pool.query(query, [
            data.customer_id,
            data.orderNo,
            orderDate,
            data.length,
            data.half_shoulder,
            data.to_sleeve,
            data.chest,
            data.waist,
            data.collar,
            data.waist_coat_length,
            data.sherwani_length,
            data.other_notes
        ]);
        return result;
    } catch (error) {
        console.error('Failed to create shirt measurement:', error);
        throw error;
    }
}
