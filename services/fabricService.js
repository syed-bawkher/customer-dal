import mysql from 'mysql2';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

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
    const { description, available_length, fabric_code, fabric_brand, stock_location, image, barcode } = fabric;
    const sql = "INSERT INTO Fabric (description, available_length, fabric_code, fabric_brand, stock_location, image, barcode) VALUES (?, ?, ?, ?, ?, ?, ?)";
    try {
        const [result] = await pool.query(sql, [description, available_length, fabric_code, fabric_brand, stock_location, image, barcode]);
        console.log(`at create fabric Fabric created with ID: ${result.insertId}`);
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

// Function to delete a fabric and all related fabric orders
export async function deleteFabric(fabricId) {
    const connection = await pool.getConnection();
    try {
        // Start a transaction to ensure atomicity
        await connection.beginTransaction();

        // Retrieve all related fabric orders
        const [fabricOrders] = await connection.query("SELECT * FROM FabricOrderList WHERE fabric_id = ?", [fabricId]);

        if (fabricOrders.length > 0) {
            // Delete all related fabric orders from FabricOrderList
            await connection.query("DELETE FROM FabricOrderList WHERE fabric_id = ?", [fabricId]);
            console.log(`Deleted ${fabricOrders.length} fabric orders related to fabric ID ${fabricId}`);
        }

        // Delete the fabric image from S3 (if exists)
        const [fabricRows] = await connection.query("SELECT image FROM Fabric WHERE fabric_id = ?", [fabricId]);
        if (fabricRows.length > 0 && fabricRows[0].image) {
            const s3Key = fabricRows[0].image;
            const command = new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: s3Key,
            });
            await s3Client.send(command);
            console.log(`Image ${s3Key} for fabric ${fabricId} deleted successfully.`);
        }

        // Finally, delete the fabric from the Fabric table
        const [result] = await connection.query("DELETE FROM Fabric WHERE fabric_id = ?", [fabricId]);
        if (result.affectedRows === 0) {
            throw new Error('No fabric found with the provided ID.');
        }

        // Commit the transaction if everything succeeded
        await connection.commit();
        console.log(`Fabric with ID ${fabricId} and its related fabric orders were deleted successfully.`);
        return result;
    } catch (error) {
        // Roll back the transaction in case of an error
        await connection.rollback();
        console.error('Failed to delete fabric and its related orders:', error);
        throw error;
    } finally {
        // Release the connection
        connection.release();
    }
}

// Function to search fabric by brand name, fabric code, fabric ID, barcode, or stock location
export async function searchFabric(searchQuery) {
    const sql = `
        SELECT fabric_id, description, available_length, fabric_code, fabric_brand, stock_location, image, barcode 
        FROM Fabric 
        WHERE fabric_code LIKE ? 
        OR fabric_brand LIKE ?
        OR description LIKE ? 
        OR fabric_id LIKE ? 
        OR barcode LIKE ? 
        OR stock_location LIKE ?
    `;
    const searchPattern = `%${searchQuery}%`;  // Using '%' wildcard for flexible matching

    try {
        const [rows] = await pool.query(sql, [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern]);
        return rows;
    } catch (error) {
        console.error('Failed to search for fabrics:', error);
        throw error;
    }
}


// Function to create a fabric if the fabric code does not exist (case-insensitive)
export async function createFabricIfNotExist(fabricCode) {
    if (!fabricCode) return null;  // Return null if fabricCode is null or undefined

    try {
        // Search for an existing fabric with the same fabric_code (case-insensitive)
        const result = await pool.query("SELECT * FROM Fabric WHERE LOWER(fabric_code) = LOWER(?)", [fabricCode]);

        // Ensure result is iterable and contains rows
        const rows = Array.isArray(result) ? result[0] : result;
        
        if (rows && rows.length === 0) {
            // If no fabric with the given fabric code exists, create a new one
            const defaultFabric = {
                description: 'N/A',
                available_length: 0,
                fabric_code: fabricCode,  // Use the provided fabric code
                fabric_brand: 'N/A',
                stock_location: 'N/A',
                image: null,
                barcode: 'N/A'
            };
            console.log(defaultFabric)
            console.log(`default fabric`)
            const createResult = await createFabric(defaultFabric);
            console.log(`New fabric created with fabric code: ${fabricCode} from createFabricIfNotExist function`);

            return createResult;  // Return the result of the insert, which should include the insertId
        } else if (rows && rows.length > 0) {
            console.log(`Fabric with fabric code "${fabricCode}" already exists.`);
            return rows[0];  // Return the existing fabric data
        }
        return null;  // Return null if the query returned no valid result
    } catch (error) {
        console.error('Failed to check or create fabric by fabric code:', error);
        throw error;
    }
}



// Function to generate a presigned URL for uploading fabric image
export async function generateFabricUploadUrl(fabricId, filename, expiresIn = 3600) {
    const s3Key = `fabrics/${fabricId}/${filename}`;
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: s3Key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    // Optionally, save the S3 key in the Fabric table or a related table
    await pool.query("UPDATE Fabric SET image = ? WHERE fabric_id = ?", [s3Key, fabricId]);

    return url;
}

// Function to retrieve the presigned URL for viewing the fabric image
export async function getFabricImageUrl(fabricId, expiresIn = 3600) {
    const [rows] = await pool.query("SELECT image FROM Fabric WHERE fabric_id = ?", [fabricId]);

    if (rows.length === 0 || !rows[0].image) {
        throw new Error("Image not found for the specified fabric.");
    }

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: rows[0].image,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
}

// Function to delete the fabric image
export async function deleteFabricImage(fabricId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query("SELECT image FROM Fabric WHERE fabric_id = ?", [fabricId]);

        if (rows.length === 0 || !rows[0].image) {
            throw new Error("Image not found for the specified fabric.");
        }

        const s3Key = rows[0].image;
        await connection.beginTransaction();

        // Delete image from the S3 bucket
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
        });
        await s3Client.send(command);

        // Optionally, remove the S3 key reference from the Fabric table
        await connection.query("UPDATE Fabric SET image = NULL WHERE fabric_id = ?", [fabricId]);

        await connection.commit();
        console.log(`Image ${s3Key} for fabric ${fabricId} deleted successfully.`);
    } catch (error) {
        await connection.rollback();
        console.error('Failed to delete fabric image:', error);
        throw error;
    } finally {
        connection.release();
    }
}
