import mysql from "mysql2";
import dotenv from "dotenv";
import { createFabricIfNotExist, getFabricById } from "./fabricService.js";

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
  })
  .promise();

export async function getAllItems() {
  const [rows] = await pool.query("SELECT * FROM Items");
  return rows;
}

export async function getItemById(itemId) {
  const [rows] = await pool.query("SELECT * FROM Items WHERE item_id = ?", [
    itemId,
  ]);
  return rows[0];
}

export async function getItemsByOrderNo(orderNo) {
  const [rows] = await pool.query("SELECT * FROM Items WHERE orderNo = ?", [
    orderNo,
  ]);
  return rows;
}

async function createItemQuery(
  orderNo,
  item_name,
  item_type,
  measurement_id,
  fabric_id,
  lining_fabric_id
) {
  let fabricId;
  let lining_fabricId;

  if (!(await getFabricById(fabric_id))) {
    const fabric = await createFabricIfNotExist(fabric_id);
    console.log(`Fabric created with ID: ${fabric.insertId}`);
    fabricId = fabric.insertId;
  } else {
    fabricId = fabric_id;
  }

  if (!(await getFabricById(lining_fabric_id))) {
    const lining_fabric = await createFabricIfNotExist(lining_fabric_id);
    console.log(`Fabric created with ID: ${lining_fabric.insertId}`);
    lining_fabricId = lining_fabric.insertId;
  } else {
    lining_fabricId = lining_fabric_id;
  }

  const columns = `${item_type}_measurement_id, orderNo, item_name, item_type, fabric_id, lining_fabric_id`;
  const values = "?, ?, ?, ?, ?, ?";
  const sql = `INSERT INTO Items (${columns}) VALUES (${values});`;
  return pool.query(sql, [
    measurement_id,
    orderNo,
    item_name,
    item_type,
    fabricId,
    lining_fabricId,
  ]);
}

export async function createJacket(
  orderNo,
  item_name,
  jacket_measurement_id,
  fabric_id,
  lining_fabric_id
) {
  try {
    const [result] = await createItemQuery(
      orderNo,
      item_name,
      "jacket",
      jacket_measurement_id,
      fabric_id,
      lining_fabric_id
    );
    console.log(`Jacket created with ID: ${result.insertId}`);
    return result;
  } catch (error) {
    console.error("Failed to create jacket:", error);
    throw error;
  }
}

export async function createShirt(
  orderNo,
  item_name,
  shirt_measurement_id,
  fabric_id,
  lining_fabric_id
) {
  try {
    const [result] = await createItemQuery(
      orderNo,
      item_name,
      "shirt",
      shirt_measurement_id,
      fabric_id,
      lining_fabric_id
    );
    console.log(`Shirt created with ID: ${result.insertId}`);
    return result;
  } catch (error) {
    console.error("Failed to create shirt:", error);
    throw error;
  }
}

export async function createPant(
  orderNo,
  item_name,
  pant_measurement_id,
  fabric_id,
  lining_fabric_id
) {
  try {
    const [result] = await createItemQuery(
      orderNo,
      item_name,
      "pant",
      pant_measurement_id,
      fabric_id,
      lining_fabric_id
    );
    console.log(`Pant created with ID: ${result.insertId}`);
    return result;
  } catch (error) {
    console.error("Failed to create pant:", error);
    throw error;
  }
}

export async function updateItem(itemId, fields) {
  const setQueryParts = [];
  const queryValues = [];

  for (const [key, value] of Object.entries(fields)) {
    if (value !== null) {
      // Include the fields that are explicitly provided
      setQueryParts.push(`${key} = ?`);
      queryValues.push(value);
    }
  }

  if (setQueryParts.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  const queryString = `UPDATE Items SET ${setQueryParts.join(
    ", "
  )} WHERE item_id = ?`;
  queryValues.push(itemId);

  try {
    const [result] = await pool.query(queryString, queryValues);
    if (result.affectedRows === 0) {
      throw new Error("No item found with the provided ID.");
    }
    return result;
  } catch (error) {
    console.error("Failed to update item:", error);
    throw error;
  }
}

export async function deleteItem(itemId) {
  try {
    const [result] = await pool.query("DELETE FROM Items WHERE item_id = ?", [
      itemId,
    ]);
    if (result.affectedRows === 0) {
      throw new Error("No item found with the provided ID.");
    }
    return result;
  } catch (error) {
    console.error("Failed to delete item:", error);
    throw error;
  }
}

export async function createItems(orderNo, items) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const results = [];

    for (const item of items) {
      const {
        item_name,
        item_type,
        measurement_id,
        fabric_id,
        lining_fabric_id,
      } = item;
      const columns = `${item_type.toLowerCase()}_measurement_id, orderNo, item_name, item_type, fabric_id, lining_fabric_id`;
      const values = "?, ?, ?, ?, ?, ?";

      let fabricId;
      let lining_fabricId;

      const existingFabric = await getFabricById(fabric_id);
      const existingLiningFabric = await getFabricById(lining_fabric_id);

      if (existingFabric) {
        fabricId = fabric_id; // Use the existing fabric_id
      } else if (fabric_id == null) {
        fabricId = null; // If fabric_id is null, set it to null
      } else {
        const fabric = await createFabricIfNotExist(fabric_id);
        if (fabric) {
          console.log(
            `at create items Fabric created with ID: ${fabric.insertId || fabric.id}`
          ); // Log the fabric ID
          fabricId = fabric.insertId || fabric.id; // Assign the fabric ID (insertId if newly created, id if fetched)
        }
      }

      console.log(`Lining fabric: ${lining_fabric_id}`); // Log the fabric ID
      if (existingLiningFabric) {
        lining_fabricId = lining_fabric_id; // Use the existing lining_fabric_id
      } else if (lining_fabric_id == null) {
        lining_fabricId = null; // If lining_fabric_id is null, set it to null
      } else {
        const liningFabric = await createFabricIfNotExist(lining_fabric_id);
        if (liningFabric) {
          console.log(
            `Lining fabric created with ID: ${
              liningFabric.insertId || liningFabric.id
            }`
          ); // Log the fabric ID
          lining_fabricId = liningFabric.insertId || liningFabric.id; // Assign the lining fabric ID
        }
      }

      const sql = `INSERT INTO Items (${columns}) VALUES (${values});`;
      const [result] = await connection.query(sql, [
        measurement_id,
        orderNo,
        item_name,
        item_type,
        fabricId,
        lining_fabricId,
      ]);
      results.push(result);
    }

    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    console.error("Transaction failed, rolled back.", error);
    throw error;
  } finally {
    connection.release();
  }
}
