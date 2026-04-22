import "./utils/LoadEnvConfig.js"
import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { projectRoot } from "./utils/Paths.js";
import routes from "./routes/routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.engine("hbs", engine(
    {
        layoutsDir: "views/layouts",
        defaultLayout: 'layout',
        extname: "hbs",
        helpers: {
            increment: (value) => value + 1,
            decrement: (value) => value - 1,
            gt: (a, b) => a > b,
            lt: (a, b) => a < b
        }
    }
));

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(projectRoot, "public")));

app.use(cookieParser());
app.use(express.json());

app.use("/", routes);

app.use((req, res) => {
    res.status(404).render("404", { title: "Page Not Found" });
});

try {
    app.listen(process.env.PORT || 4000, "0.0.0.0");
    console.log(`Server running on http://localhost:${process.env.PORT || 4000}`);
} catch (err) {
    console.error("Error connecting to the server:", err);
}