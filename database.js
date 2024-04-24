import mysql from 'mysql2';
import dotenv from 'dotenv';


dotenv.config();  // This should be at the top

console.log('Database Host:', process.env.SB_DB_HOST);
console.log('Database User:', process.env.SB_DB_USERNAME);
console.log('Database Password:', process.env.SB_DB_PASSWORD);
console.log('Database Name:', process.env.SB_DB_DATABASE);


const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

const result = await pool.query("SELECT * FROM Customer")
const rows = result[0];
console.log(rows[0]);
