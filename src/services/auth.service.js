import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUser } from "../repositories/user.repository.js";

export const loginUser = async (username, password) => {

    //Buscar usuario
    const user = await findUser(username);

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    //Validar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("INVALID_PASSWORD");
    }

    //Generar token
    const token = jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return token;
}