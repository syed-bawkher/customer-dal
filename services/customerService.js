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


export async function createCustomer(first_name, last_name, mobile, add1, middle_name = null, add2 = null, add3 = null, add4 = null, email = null, office_phone = null, residential_phone = null, last_ordered_date = null) {
    const query = `
        INSERT INTO Customer (first_name, middle_name, last_name, add1, add2, add3, add4, email, mobile, office_phone, residential_phone, last_ordered_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
        const [result] = await pool.query(query, [first_name, middle_name, last_name, add1, add2, add3, add4, email, mobile, office_phone, residential_phone, last_ordered_date]);
        console.log(`Customer created with ID: ${result.insertId}`);
        return result;
    } catch (error) {
        console.error('Failed to create customer:', error);
        throw error;  // Rethrow the error to be caught by the caller
    }
}

export async function updateCustomer(customerId, fields) {
    // Build the SET part of the SQL query dynamically based on the fields object
    const setQueryParts = [];
    const queryValues = [];

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) { // Only update fields that are provided
            setQueryParts.push(`${key} = ?`);
            queryValues.push(value);
        }
    }

    if (setQueryParts.length === 0) {
        throw new Error('No valid fields provided for update');
    }

    const queryString = `UPDATE Customer SET ${setQueryParts.join(', ')} WHERE customer_id = ?`;
    queryValues.push(customerId); // Append customerId to the values array for the query

    try {
        const [result] = await pool.query(queryString, queryValues);
        if (result.affectedRows === 0) {
            throw new Error('No customer found with the provided ID.');
        }
        return result;
    } catch (error) {
        console.error('Failed to update customer:', error);
        throw error;  // Rethrow the error to be caught by the caller
    }
}


export async function deleteCustomer(customerId) {
    // Start by nullifying the customer_id in all related tables
    const relatedTables = ['Orders', 'JacketMeasurement', 'FinalJacketMeasurement', 'ShirtMeasurement', 'FinalShirtMeasurement', 'PantMeasurement', 'FinalPantMeasurement', 'Items'];
    try {
        await pool.getConnection(async conn => {
            await conn.beginTransaction();  // Start a transaction

            for (const table of relatedTables) {
                const updateQuery = `UPDATE ${table} SET customer_id = NULL WHERE customer_id = ?`;
                await conn.query(updateQuery, [customerId]);
            }

            // Now, delete the customer
            const deleteQuery = "DELETE FROM Customer WHERE customer_id = ?";
            const [deleteResult] = await conn.query(deleteQuery, [customerId]);

            if (deleteResult.affectedRows === 0) {
                throw new Error('No customer found with the provided ID.');
            }

            await conn.commit();  // Commit the transaction
            console.log(`Customer deleted successfully and all references were set to NULL.`);
        });
    } catch (error) {
        console.error('Failed to delete customer:', error);
        throw error;  // Rethrow the error to be caught by the caller
    }
}

