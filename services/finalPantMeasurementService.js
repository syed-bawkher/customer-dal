import mysql from 'mysql2';
import dotenv from 'dotenv';


dotenv.config();  // This should be at the top


const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

export async function getFinalPantMeasurementByCustomerId(id) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`length`,`inseem`,`waist`,`hips`,`bottom`,`knee`,`other_notes` FROM `FinalPantMeasurement` WHERE `customer_id` = ?;", [id])
    const rows = result[0];
    return rows;
}

export async function getFinalPantMeasurementByOrderNo(orderNo) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`length`,`inseem`,`waist`,`hips`,`bottom`,`knee`,`other_notes` FROM `FinalPantMeasurement` WHERE `orderNo` = ?", [orderNo]);
    const rows = result[0];
    return rows;
}

// Create initial Pant Measurement
export async function createFinalPantMeasurement(data) {
    const query = `
        INSERT INTO FinalPantMeasurement (customer_id, orderNo, date, length, inseem, waist, hips, bottom, knee, other_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
        const [result] = await pool.query(query, [
            data.customer_id,
            data.orderNo,
            data.date,
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
        console.error('Failed to create final pant measurement:', error);
        throw error;
    }
}