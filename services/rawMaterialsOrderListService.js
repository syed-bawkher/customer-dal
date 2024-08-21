import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

// Function to get all raw materials orders
export async function getAllRawMaterialsOrders() {
    const [rows] = await pool.query("SELECT * FROM RawMaterialsOrderList");
    return rows;
}

// Function to get a raw materials order by ID
export async function getRawMaterialsOrderById(orderId) {
    const [rows] = await pool.query("SELECT * FROM RawMaterialsOrderList WHERE order_id = ?", [orderId]);
    return rows[0];
}

// Function to create a new raw materials order
export async function createRawMaterialsOrder(order) {
    const { product_name, description, raw_material_code, color, supplier_name, supplier_id, quantity, ordered_date } = order;
    const sql = "INSERT INTO RawMaterialsOrderList (product_name, description, raw_material_code, color, supplier_name, supplier_id, quantity, ordered_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    try {
        const [result] = await pool.query(sql, [product_name, description, raw_material_code, color, supplier_name, supplier_id, quantity, ordered_date]);
        console.log(`Raw materials order created with ID: ${result.insertId}`);
        return result;
    } catch (error) {
        console.error('Failed to create raw materials order:', error);
        throw error;
    }
}

// Function to update a raw materials order
export async function updateRawMaterialsOrder(orderId, fields) {
    const setQueryParts = [];
    const queryValues = [];

    for (const [key, value] of Object.entries(fields)) {
        if (value !== null) {
            setQueryParts.push(`${key} = ?`);
            queryValues.push(value);
        }
    }

    if (setQueryParts.length === 0) {
        throw new Error('No valid fields provided for update');
    }

    const queryString = `UPDATE RawMaterialsOrderList SET ${setQueryParts.join(', ')} WHERE order_id = ?`;
    queryValues.push(orderId);

    try {
        const [result] = await pool.query(queryString, queryValues);
        if (result.affectedRows === 0) {
            throw new Error('No raw materials order found with the provided ID.');
        }
        return result;
    } catch (error) {
        console.error('Failed to update raw materials order:', error);
        throw error;
    }
}

// Function to delete a raw materials order
export async function deleteRawMaterialsOrder(orderId) {
    try {
        const [result] = await pool.query("DELETE FROM RawMaterialsOrderList WHERE order_id = ?", [orderId]);
        if (result.affectedRows === 0) {
            throw new Error('No raw materials order found with the provided ID.');
        }
        return result;
    } catch (error) {
        console.error('Failed to delete raw materials order:', error);
        throw error;
    }
}