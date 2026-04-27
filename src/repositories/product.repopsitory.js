import { pool } from "../config/db.js"

export const upsertProducts = async (products) => {
    if (!products.length) return;

    const values = [];
    const placeholders = products.map((p, i) => {
        const idx = i * 5;
        values.push(parseInt(p.ID), p.Nombre_Mercancia, parseInt(p.Cantidad), p.Transportista, p.fecha_salida);
        return `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5})`;
    });

    const query = `
        INSERT INTO products (id, nombre_mercancia, cantidad, transportista, fecha_salida)
        VALUES ${placeholders.join(", ")}
        ON CONFLICT (id)
        DO UPDATE SET
            nombre_mercancia = EXCLUDED.nombre_mercancia,
            cantidad = EXCLUDED.cantidad,
            transportista = EXCLUDED.transportista,
            fecha_salida = EXCLUDED.fecha_salida
    `;

    await pool.query(query, values);
};

export const getAllProducts = async () => {
    const result = await pool.query(
        "SELECT * FROM products ORDER BY id",
    );
    return result.rows;
}

export const getProductsPaginated = async (limit, offset) => {
    const result = await pool.query(
        "SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2",
        [limit, offset]
    );
    return result.rows;
};

export const countProducts = async () => {
    const result = await pool.query("SELECT COUNT(*) FROM products");
    return parseInt(result.rows[0].count);
};