import mysql from 'mysql2';
import dotenv from 'dotenv';


dotenv.config();  // This should be at the top


const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

export async function getFinalJacketMeasurementByCustomerId(id) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`jacket_length`,`natural_length`,`back_length`,`x_back`,`half_shoulder`,`to_sleeve`,`chest`,`waist`,`collar`,`waist_coat_length`,`sherwani_length`,`other_notes` FROM `FinalJacketMeasurement` WHERE `customer_id` = ?", [id])
    const rows = result[0];
    return rows;
}

export async function getFinalJacketMeasurementByOrderNo(orderNo) {
    const result = await pool.query("SELECT `measurement_id`,`date`,`orderNo`,`jacket_length`,`natural_length`,`back_length`,`x_back`,`half_shoulder`,`to_sleeve`,`chest`,`waist`,`collar`,`waist_coat_length`,`sherwani_length`,`other_notes` FROM `FinalJacketMeasurement` WHERE `orderNo` = ?", [orderNo]);
    const rows = result[0];
    return rows;
}

// Create initial Jacket Measurement
export async function createFinalJacketMeasurement(data) {
    const query = `
        INSERT INTO FinalacketMeasurement (customer_id, orderNo, date, jacket_length, natural_length, back_length, x_back, half_shoulder, to_sleeve, chest, waist, collar, waist_coat_length, sherwani_length, other_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
        const [result] = await pool.query(query, [
            data.customer_id,
            data.orderNo,
            data.date,
            data.jacket_length,
            data.natural_length,
            data.back_length,
            data.x_back,
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
        console.error('Failed to create jacket measurement:', error);
        throw error;
    }
}