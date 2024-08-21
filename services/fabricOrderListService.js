import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

// Function to get all fabric orders
export async function getAllFabricOrders() {
    const [rows] = await pool.query("SELECT * FROM FabricOrderList");
    return rows;
}

// Function to get a fabric order by ID
export async function getFabricOrderById(orderId) {
    const [rows] = await pool.query("SELECT * FROM FabricOrderList WHERE order_id = ?", [orderId]);
    return rows[0];
}

// Function to create a new fabric order
export async function createFabricOrder(order) {
    const { fabric_code, description, supplier_name, supplier_id, meters, ordered_date, ordered_for } = order;
    const sql = "INSERT INTO FabricOrderList (fabric_code, description, supplier_name, supplier_id, meters, ordered_date, ordered_for) VALUES (?, ?, ?, ?, ?, ?, ?)";
    try {
        const [result] = await pool.query(sql, [fabric_code, description, supplier_name, supplier_id, meters, ordered_date, ordered_for]);
        console.log(`Fabric order created with ID: ${result.insertId}`);
        return result;
    } catch (error) {
        console.error('Failed to create fabric order:', error);
        throw error;
    }
}

// Function to update a fabric order
export async function updateFabricOrder(orderId, fields) {
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

    const queryString = `UPDATE FabricOrderList SET ${setQueryParts.join(', ')} WHERE order_id = ?`;
    queryValues.push(orderId);

    try {
        const [result] = await pool.query(queryString, queryValues);
        if (result.affectedRows === 0) {
            throw new Error('No fabric order found with the provided ID.');
        }
        return result;
    } catch (error) {
        console.error('Failed to update fabric order:', error);
        throw error;
    }
}

// Function to delete a fabric order
export async function deleteFabricOrder(orderId) {
    try {
        const [result] = await pool.query("DELETE FROM FabricOrderList WHERE order_id = ?", [orderId]);
        if (result.affectedRows === 0) {
            throw new Error('No fabric order found with the provided ID.');
        }
        return result;
    } catch (error) {
        console.error('Failed to delete fabric order:', error);
        throw error;
    }
}

// Function to get all fabric orders by fabric code
export async function getFabricOrdersByFabricCode(fabricCode) {
    try {
        const [rows] = await pool.query("SELECT * FROM FabricOrderList WHERE fabric_code = ?", [fabricCode]);
        return rows;
    } catch (error) {
        console.error('Failed to get fabric orders by fabric code:', error);
        throw error;
    }
}
