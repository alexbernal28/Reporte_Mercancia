import { loginUser } from "../services/auth.service.js";

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await loginUser(username, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
        });

        return res.redirect("/");
    } catch (error) {
        if (error.message === "USER_NOT_FOUND") {
            return res.redirect("/login?error=user_not_found");
        }

        if (error.message === "INVALID_PASSWORD") {
            return res.redirect("/login?error=invalid_password");
        }

        console.error("LOGIN ERROR:", error);

        return res.redirect("/login?error=server_error");
    }
}