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

export async function getShirtMeasurementByCustomerId(id) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`length`,`half_shoulder`,`to_sleeve`,`chest`,`waist`,`collar`,`other_notes` FROM `ShirtMeasurement` WHERE `customer_id` = ?", [id])
    const rows = result[0];
    return rows;
}

export async function getShirtMeasurementByOrderNo(orderNo) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`length`,`half_shoulder`,`to_sleeve`,`chest`,`waist`,`collar`,`other_notes` FROM `ShirtMeasurement` WHERE `orderNo` = ?", [orderNo]);
    const rows = result[0];
    return rows;
}

export async function createShirtMeasurement(data) {
    try {
        const measurementId = uuidv4(); // Generate a UUID for the measurement
        const orderDate = await getOrderDate(data.orderNo); // Retrieve order date based on order number

        const query = `
            INSERT INTO ShirtMeasurement (measurement_id, customer_id, orderNo, date, length, half_shoulder, to_sleeve, chest, waist, collar, other_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await pool.query(query, [
            measurementId,  // Use the generated UUID
            data.customer_id,
            data.orderNo,
            orderDate,
            data.length,
            data.half_shoulder,
            data.to_sleeve,
            data.chest,
            data.waist,
            data.collar,
            data.other_notes
        ]);

        return { measurement_id: measurementId }; // Return the UUID used in the insert
    } catch (error) {
        console.error('Failed to create shirt measurement:', error);
        throw error;
    }
}
