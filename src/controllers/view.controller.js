import { getProductsPaginated, countProducts } from "../repositories/product.repopsitory.js";
import "../utils/LoadEnvConfig.js";

export const showlogin = (req, res) => {
    const error = req.query.error;

    let message = null;

    if (error === "no_token") {
        message = "Debes iniciar sesión para continuar";
    }

    if (error === "invalid_token") {
        message = "Sesión inválida, inicia sesión nuevamente";
    }

    if (error === "user_not_found") {
        message = "Usuario no encontrado";
    }

    if (error === "invalid_password") {
        message = "Contraseña incorrecta.";
    }

    res.render("auth/login", { message });
};

export const showHome = async (req, res) => {

    const CONTAINER_NAME = process.env.APP_NAME || 'unknow';

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit

    const products = await getProductsPaginated(limit, offset);
    const total = await countProducts();

    const totalPages = Math.ceil(total / limit);

    const formattedProducts = products.map(p => ({
        ...p,
        fecha_formateada: new Date(p.fecha_salida).toLocaleDateString("en-CA")
    }));

    res.render("home/index", {
        products: formattedProducts,
        currentPage: page,
        totalPages,
        hasproducts: formattedProducts.length > 0,
        CONTAINER_NAME,
        user: req.user,
        title: "Reporte de Mercancia"
    });
};