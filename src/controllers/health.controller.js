import { getHealthStatus } from "../services/health.service.js";

export const health = async (req, res) => {
    try {
        const status = await getHealthStatus();

        if (status.status === "ok") {
            return res.status(200).json(status);
        }

        return res.status(500).json(status);
    } catch (error) {
        return res.status(500).json({
            status: "error",
            api: "down",
            database: "unknown",
            version: process.env.APP_VERSION || "1.0.0",
            uptime: process.uptime()
        });

    }
}