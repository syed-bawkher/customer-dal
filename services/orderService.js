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

// Function to create a new order
export async function createOrder(orderNo, customerId, date, note) {
    const order = {
        orderNo: orderNo,
        customerId: customerId,
        date: date,
        note: note,
    };

    const query = `
        INSERT INTO Orders (orderNo, customer_id, date, onote)
        VALUES (?, ?, ?, ?);
    `;
    try {
        const [result] = await pool.query(query, [orderNo, customerId, date, note]);
        console.log(`Order created with Order No: ${orderNo}`);
        return order;
    } catch (error) {
        console.error('Failed to create order:', error);
        throw error;  // Rethrow the error to be caught by the caller
    }
}

export async function getOrderDate(orderNo) {
    try {
        const [result] = await pool.query("SELECT date FROM Orders WHERE orderNo = ?", [orderNo]);
        if (result.length > 0) {
            return result[0].date;  // Assuming 'date' is the column name in the Orders table
        } else {
            throw new Error("Order not found");
        }
    } catch (error) {
        console.error('Failed to fetch order date:', error);
        throw error;
    }
}

// Function to delete an order and its associated entities
export async function deleteOrder(orderNo) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Delete from Items table
        await connection.query("DELETE FROM Items WHERE orderNo = ?", [orderNo]);

        // Delete from FinalPantMeasurement table
        await connection.query("DELETE FROM FinalPantMeasurement WHERE orderNo = ?", [orderNo]);

        // Delete from PantMeasurement table
        await connection.query("DELETE FROM PantMeasurement WHERE orderNo = ?", [orderNo]);

        // Delete from FinalShirtMeasurement table
        await connection.query("DELETE FROM FinalShirtMeasurement WHERE orderNo = ?", [orderNo]);

        // Delete from ShirtMeasurement table
        await connection.query("DELETE FROM ShirtMeasurement WHERE orderNo = ?", [orderNo]);

        // Delete from FinalJacketMeasurement table
        await connection.query("DELETE FROM FinalJacketMeasurement WHERE orderNo = ?", [orderNo]);

        // Delete from JacketMeasurement table
        await connection.query("DELETE FROM JacketMeasurement WHERE orderNo = ?", [orderNo]);

        // Finally, delete from Orders table
        await connection.query("DELETE FROM Orders WHERE orderNo = ?", [orderNo]);

        await connection.commit();
        console.log(`Order ${orderNo} and all associated entities have been deleted successfully.`);
    } catch (error) {
        await connection.rollback();
        console.error('Failed to delete order and its associated entities:', error);
        throw error;  // Rethrow the error to be caught by the caller
    } finally {
        connection.release();
    }
}
