import { pool } from "../config/db.js"

export const checkDatabase = async () => {
    try {
        await pool.query("SELECT 1");
        return true;
    } catch (error) {
        return false;
    }
}