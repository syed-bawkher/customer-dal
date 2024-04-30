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

export async function searchCustomers(searchTerm) {
    const searchPattern = `%${searchTerm}%`;  // Used for partial matching on name
    const query = `
        SELECT * FROM Customer
        WHERE CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', IFNULL(last_name, '')) LIKE ?
        OR mobile = ?
        OR office_phone = ?
        OR residential_phone = ?;
    `;
    try {
        const [rows] = await pool.query(query, [searchPattern, searchTerm, searchTerm, searchTerm]);
        return rows;
    } catch (error) {
        console.error('Database query failed:', error);
        throw error;  // Rethrow the error to be caught by the caller
    }
}


