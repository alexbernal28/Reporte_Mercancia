import { pool } from "../config/db.js";

//Acceso a datos
export const findUser = async (userName) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [userName]
    );

    return result.rows[0];
};