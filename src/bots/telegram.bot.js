import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const TOKEN = process.env.TELEGRAM_TOKEN;
const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;

export const startTelegramBot = () => {
    const bot = new TelegramBot(TOKEN, { polling: true });

    bot.onText(/\/get/, async (msg) => {
        const chatID = msg.chat.id;

        try {
            const res = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`
                }
            });

            const products = res.data;

            if (!products || products.length === 0) {
                return bot.sendMessage(chatID, "No hay mercancías.");
            }

            const formattedProducts = products.map(p => ({
                ...p,
                fecha_formateada: new Date(p.fecha_salida).toLocaleDateString("en-CA")
            }));

            const message = formattedProducts
                .slice(0, 10)
                .map((p, i) => `${i + 1}. ${p.nombre_mercancia} - ${p.cantidad} - ${p.fecha_formateada}\n`)
                .join("\n");

            bot.sendMessage(chatID, message);

        } catch (error) {
            console.error("BOT ERROR:", error.message);
            bot.sendMessage(chatID, "Error al consultar la API.");
        }
    });

    bot.onText(/\/health/, async (msg) => {
        const chatID = msg.chat.id;

        try {
            const res = await axios.get(process.env.HEALTH_URL, {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`
                }
            });

            const data = res.data;

            const message = `
                Estado de la app

                API: ${data.api === "up" ? "OK" : "ERROR"}
                DB: ${data.database === "up" ? "OK" : "ERROR"}
                Version: ${data.version}
                Uptime: ${Math.floor(data.uptime)}s
            `;

            bot.sendMessage(chatID, message);

        } catch (error) {
            console.error("BOT HEALTH ERROR: ", error.message);

            bot.sendMessage(chatID, "No se pudo consultar el estado del sistema");
        }
    });

    console.log("Telegram Bot Running");
}

startTelegramBot();