import mysql from 'mysql2';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


dotenv.config();  // This should be at the top


const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

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

        // Delete from OrderPhotos table
        await connection.query("DELETE FROM OrderPhotos WHERE orderNo = ?", [orderNo]);

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

//S3 Photo Upload

export async function generatePresignedUrl(orderNo, key, expiresIn = 3600) {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    await pool.query("INSERT INTO OrderPhotos (orderNo, s3_key) VALUES (?, ?)", [orderNo, key]);

    return url;
}

export async function getOrderPhotoCount(orderNo) {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM OrderPhotos WHERE orderNo = ?", [orderNo]);
    return rows[0].count;
}

// Function to get all photos of an order
export async function getOrderPhotos(orderNo, expiresIn = 3600) {
    const [rows] = await pool.query("SELECT s3_key FROM OrderPhotos WHERE orderNo = ?", [orderNo]);

    const photoUrls = await Promise.all(
        rows.map(async (row) => {
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: row.s3_key,
            });

            const url = await getSignedUrl(s3Client, command, { expiresIn });
            return { key: row.s3_key, url };
        })
    );

    return photoUrls;
}

// Function to delete a photo
export async function deletePhoto(orderNo, s3Key) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Delete photo from the database
        await connection.query("DELETE FROM OrderPhotos WHERE orderNo = ? AND s3_key = ?", [orderNo, s3Key]);

        // Delete photo from S3 bucket
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
        });

        await s3Client.send(command);

        await connection.commit();
        console.log(`Photo ${s3Key} for order ${orderNo} deleted successfully.`);
    } catch (error) {
        await connection.rollback();
        console.error('Failed to delete photo:', error);
        throw error; 
    } finally {
        connection.release();
    }
}
