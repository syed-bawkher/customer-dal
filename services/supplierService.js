import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

// Function to get all suppliers
export async function getAllSuppliers() {
    const [rows] = await pool.query("SELECT * FROM Supplier");
    return rows;
}

// Function to get a supplier by ID
export async function getSupplierById(supplierId) {
    const [rows] = await pool.query("SELECT * FROM Supplier WHERE supplier_id = ?", [supplierId]);
    return rows[0];
}

// Function to create a new supplier
export async function createSupplier(supplier) {
    const {
        supplier_name, add1, add2, add3, phone_number1, phone_number2,
        phone_number3, email, primary_contact_name1, primary_contact_name2,
        primary_contact_name3, notes
    } = supplier;
    const sql = `INSERT INTO Supplier (
        supplier_name, add1, add2, add3, phone_number1, phone_number2,
        phone_number3, email, primary_contact_name1, primary_contact_name2,
        primary_contact_name3, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
        const [result] = await pool.query(sql, [
            supplier_name, add1, add2, add3, phone_number1, phone_number2,
            phone_number3, email, primary_contact_name1, primary_contact_name2,
            primary_contact_name3, notes
        ]);
        console.log(`Supplier created with ID: ${result.insertId}`);
        return result;
    } catch (error) {
        console.error('Failed to create supplier:', error);
        throw error;
    }
}

// Function to update a supplier
export async function updateSupplier(supplierId, fields) {
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

    const queryString = `UPDATE Supplier SET ${setQueryParts.join(', ')} WHERE supplier_id = ?`;
    queryValues.push(supplierId);

    try {
        const [result] = await pool.query(queryString, queryValues);
        if (result.affectedRows === 0) {
            throw new Error('No supplier found with the provided ID.');
        }
        return result;
    } catch (error) {
        console.error('Failed to update supplier:', error);
        throw error;
    }
}

// Function to delete a supplier
export async function deleteSupplier(supplierId) {
    try {
        const [result] = await pool.query("DELETE FROM Supplier WHERE supplier_id = ?", [supplierId]);
        if (result.affectedRows === 0) {
            throw new Error('No supplier found with the provided ID.');
        }
        return result;
    } catch (error) {
        console.error('Failed to delete supplier:', error);
        throw error;
    }
}
