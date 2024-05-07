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

// Create initial Pant Measurement
export async function createPantMeasurement(data) {
    try {
        const orderDate = await getOrderDate(data.orderNo);
        const query = `
            INSERT INTO PantMeasurement (customer_id, orderNo, date, length, inseem, waist, hips, bottom, knee, other_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const [result] = await pool.query(query, [
            data.customer_id,
            data.orderNo,
            orderDate,
            data.length,
            data.inseem,
            data.waist,
            data.hips,
            data.bottom,
            data.knee,
            data.other_notes
        ]);
        return result;
    } catch (error) {
        console.error('Failed to create pant measurement:', error);
        throw error;
    }
}
