import { upsertProducts } from "../repositories/product.repopsitory.js";

export const createProducts = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        const products = req.body;

        if (!products) {
            return res.status(400).json({ message: "No data received" });
        }

        const safeProducts = Array.isArray(products)
            ? products
            : [products];

        await upsertProducts(safeProducts);

        res.json({ message: "Productos procesados" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
};