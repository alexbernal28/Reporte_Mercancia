import { checkDatabase } from "../repositories/health.repository.js"

export const getHealthStatus = async () => {
    const dbOk = await checkDatabase();

    return {
        status: dbOk ? "ok" : "error",
        api: "up",
        database: dbOk ? "up" : "down",
        version: process.env.APP_VERSION || "1.0.0",
        uptime: process.uptime(),
        timestamp: new Date()
    };
}