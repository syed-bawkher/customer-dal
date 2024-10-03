import mysql from 'mysql2';
import dotenv from 'dotenv';
import { createFabricIfNotExist } from './fabricService.js';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

export async function getAllItems() {
    const [rows] = await pool.query("SELECT * FROM Items");
    return rows;
}

export async function getItemById(itemId) {
    const [rows] = await pool.query("SELECT * FROM Items WHERE item_id = ?", [itemId]);
    return rows[0];
}

export async function getItemsByOrderNo(orderNo) {
    const [rows] = await pool.query("SELECT * FROM Items WHERE orderNo = ?", [orderNo]);
    return rows;
}

async function createItemQuery(orderNo, item_name, item_type, measurement_id, fabric_id, lining_fabric_id) {
    // Ensure fabric_id exists if it's not null
    if (fabric_id) await createFabricIfNotExist(fabric_id);
    // Ensure lining_fabric_id exists if it's not null
    if (lining_fabric_id) await createFabricIfNotExist(lining_fabric_id);

    const columns = `${item_type}_measurement_id, orderNo, item_name, item_type, fabric_id, lining_fabric_id`;
    const values = '?, ?, ?, ?, ?, ?';
    const sql = `INSERT INTO Items (${columns}) VALUES (${values});`;
    return pool.query(sql, [measurement_id, orderNo, item_name, item_type, fabric_id, lining_fabric_id]);
}

export async function createJacket(orderNo, item_name, jacket_measurement_id, fabric_id, lining_fabric_id) {
    try {
        const [result] = await createItemQuery(orderNo, item_name, 'jacket', jacket_measurement_id, fabric_id, lining_fabric_id);
        console.log(`Jacket created with ID: ${result.insertId}`);
        return result;
    } catch (error) {
        console.error('Failed to create jacket:', error);
        throw error;
    }
}

export async function createShirt(orderNo, item_name, shirt_measurement_id, fabric_id, lining_fabric_id) {
    try {
        const [result] = await createItemQuery(orderNo, item_name, 'shirt', shirt_measurement_id, fabric_id, lining_fabric_id);
        console.log(`Shirt created with ID: ${result.insertId}`);
        return result;
    } catch (error) {
        console.error('Failed to create shirt:', error);
        throw error;
    }
}

export async function createPant(orderNo, item_name, pant_measurement_id, fabric_id, lining_fabric_id) {
    try {
        const [result] = await createItemQuery(orderNo, item_name, 'pant', pant_measurement_id, fabric_id, lining_fabric_id);
        console.log(`Pant created with ID: ${result.insertId}`);
        return result;
    } catch (error) {
        console.error('Failed to create pant:', error);
        throw error;
    }
}

export async function updateItem(itemId, fields) {
    const setQueryParts = [];
    const queryValues = [];

    for (const [key, value] of Object.entries(fields)) {
        if (value !== null) {  // Include the fields that are explicitly provided
            setQueryParts.push(`${key} = ?`);
            queryValues.push(value);
        }
    }

    if (setQueryParts.length === 0) {
        throw new Error('No valid fields provided for update');
    }

    const queryString = `UPDATE Items SET ${setQueryParts.join(', ')} WHERE item_id = ?`;
    queryValues.push(itemId);

    try {
        const [result] = await pool.query(queryString, queryValues);
        if (result.affectedRows === 0) {
            throw new Error('No item found with the provided ID.');
        }
        return result;
    } catch (error) {
        console.error('Failed to update item:', error);
        throw error;
    }
}

export async function deleteItem(itemId) {
    try {
        const [result] = await pool.query("DELETE FROM Items WHERE item_id = ?", [itemId]);
        if (result.affectedRows === 0) {
            throw new Error('No item found with the provided ID.');
        }
        return result;
    } catch (error) {
        console.error('Failed to delete item:', error);
        throw error;
    }
}

export async function createItems(orderNo, items) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const results = [];

        for (const item of items) {
            const { item_name, item_type, measurement_id, fabric_id, lining_fabric_id } = item;
            const columns = `${item_type.toLowerCase()}_measurement_id, orderNo, item_name, item_type, fabric_id, lining_fabric_id`;
            const values = '?, ?, ?, ?, ?, ?';

            // Ensure fabric_id exists if it's not null
            if (fabric_id) await createFabricIfNotExist(fabric_id);
            // Ensure lining_fabric_id exists if it's not null
            if (lining_fabric_id) await createFabricIfNotExist(lining_fabric_id);

            const sql = `INSERT INTO Items (${columns}) VALUES (${values});`;
            const [result] = await connection.query(sql, [measurement_id, orderNo, item_name, item_type, fabric_id, lining_fabric_id]);
            results.push(result);
        }

        await connection.commit();
        return results;
    } catch (error) {
        await connection.rollback();
        console.error('Transaction failed, rolled back.', error);
        throw error;
    } finally {
        connection.release();
    }
}
