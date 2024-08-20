import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

// Function to get all fabrics
export async function getAllFabrics() {
    const [rows] = await pool.query("SELECT * FROM Fabric");
    return rows;
}

// Function to get a fabric by ID
export async function getFabricById(fabricId) {
    const [rows] = await pool.query("SELECT * FROM Fabric WHERE fabric_id = ?", [fabricId]);
    return rows[0];
}

// Function to create a new fabric
export async function createFabric(fabric) {
    const { fabric_id, description, available_length, fabric_supplier, fabric_brand, stock_location, image, barcode } = fabric;
    const sql = "INSERT INTO Fabric (fabric_id, description, available_length, fabric_supplier, fabric_brand, stock_location, image, barcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    try {
        const [result] = await pool.query(sql, [fabric_id, description, available_length, fabric_supplier, fabric_brand, stock_location, image, barcode]);
        console.log(`Fabric created with ID: ${result.insertId}`);
        return result;
    } catch (error) {
        console.error('Failed to create fabric:', error);
        throw error;
    }
}

// Function to update a fabric
export async function updateFabric(fabricId, fields) {
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

    const queryString = `UPDATE Fabric SET ${setQueryParts.join(', ')} WHERE fabric_id = ?`;
    queryValues.push(fabricId);

    try {
        const [result] = await pool.query(queryString, queryValues);
        if (result.affectedRows === 0) {
            throw new Error('No fabric found with the provided ID.');
        }
        return result;
    } catch (error) {
        console.error('Failed to update fabric:', error);
        throw error;
    }
}

// Function to delete a fabric
export async function deleteFabric(fabricId) {
    try {
        const [result] = await pool.query("DELETE FROM Fabric WHERE fabric_id = ?", [fabricId]);
        if (result.affectedRows === 0) {
            throw new Error('No fabric found with the provided ID.');
        }
        return result;
    } catch (error) {
        console.error('Failed to delete fabric:', error);
        throw error;
    }
}

// Function to create a fabric if it doesn't exist
export async function createFabricIfNotExist(fabricId) {
    if (!fabricId) return;  // Skip if fabricId is null or undefined

    const fabric = await getFabricById(fabricId);
    if (!fabric) {
        const defaultFabric = {
            fabric_id: fabricId,
            description: 'N/A',
            available_length: 0,
            fabric_supplier: 'N/A',
            fabric_brand: 'N/A',
            stock_location: 'N/A',
            image: null,
            barcode: 'N/A'
        };
        await createFabric(defaultFabric);
    }
}
