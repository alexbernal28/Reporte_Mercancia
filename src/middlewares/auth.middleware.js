import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
    let token = null;

    if (req.cookies?.token) {
        token = req.cookies.token;
    }

    const authHeader = req.headers.authorization;

    if (!token && authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        //  diferencia web y API
        if (req.path.startsWith("/api")) {
            return res.status(401).json({ message: "No autorizado" });
        }
        return res.redirect("/login?error=no_token");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (req.path.startsWith("/api")) {
            return res.status(401).json({ message: "Token inválido" });
        }
        return res.redirect("/login?error=invalid_token");
    }
};

export default requireAuth;