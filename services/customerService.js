import mysql from 'mysql2';
import dotenv from 'dotenv';


dotenv.config();  // This should be at the top


const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

export async function getCustomers() {
    const result = await pool.query("SELECT * FROM Customer")
    const rows = result[0];
    return rows;
}

export async function getCustomerById(id) {
    const result = await pool.query("SELECT * FROM Customer WHERE customer_id = ?", [id])
    const row = result[0];
    return row;
}

