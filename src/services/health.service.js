import { checkDatabase } from "../repositories/health.repository.js"

export const getHealthStatus = async () => {
    const dbOk = await checkDatabase();

    return {
        status: dbOk ? "ok" : "error",
        api: "up",
        database: dbOk ? "up" : "down",
        uptime: process.uptime(),
        timestamp: new Date()
    };
}