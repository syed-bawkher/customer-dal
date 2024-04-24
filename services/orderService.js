import mysql from 'mysql2';
import dotenv from 'dotenv';


dotenv.config();  // This should be at the top


const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

// gets all orders
export async function getOrders() {
    const result = await pool.query("SELECT * FROM `Orders`")
    const rows = result[0];
    return rows;
}

// gets order by id
export async function getOrderById(id) {
    const result = await pool.query("SELECT * FROM `Orders` WHERE orderNo = ?", [`${id}`])
    const row = result[0];
    return row;
}

// gets orders by customer id
export async function getOrdersByCustomerId(id) {
    const result = await pool.query("SELECT * FROM `Orders` WHERE customer_id = ?", [id])
    const rows = result[0];
    return rows;
}