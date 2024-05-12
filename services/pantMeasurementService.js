import mysql from 'mysql2';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; // Import uuid function
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

export async function createPantMeasurement(data) {
    try {
        const measurementId = uuidv4(); // Generate a UUID for the measurement
        const orderDate = await getOrderDate(data.orderNo); // Retrieve order date based on order number

        const query = `
            INSERT INTO PantMeasurement (measurement_id, customer_id, orderNo, date, length, inseem, waist, hips, bottom, knee, other_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await pool.query(query, [
            measurementId,  // Use the generated UUID
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

        return { measurement_id: measurementId }; // Return the UUID used in the insert
    } catch (error) {
        console.error('Failed to create pant measurement:', error);
        throw error;
    }
}
