import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import mysql from 'mysql2';


const pool = mysql.createPool({
    host: process.env.SB_DB_HOST,
    user: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_DATABASE,
}).promise();

passport.use(new BearerStrategy(async (token, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Users WHERE token = ?', [token]);
        if (rows.length === 0) {
            return done(null, false);
        }
        const user = rows[0];
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

export default passport;
