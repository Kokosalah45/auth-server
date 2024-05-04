"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const v1_1 = __importDefault(require("./routes/api/v1"));
const errors_1 = require("./errors");
const db_1 = __importDefault(require("./config/db"));
const redis_1 = __importDefault(require("./config/redis"));
const app = (0, express_1.default)();
const srcPath = __dirname;
app.set("view engine", "ejs");
app.set("views", path_1.default.join(srcPath, "views"));
app.use(express_1.default.static(path_1.default.join(srcPath, "public")));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    xPoweredBy: false,
}));
app.use("/api/v1", v1_1.default);
app.get("/", (req, res) => {
    res.redirect("/login");
});
app.get("/login", (req, res) => {
    res.render("pages/login");
});
app.use((err, req, res, next) => {
    const error = err instanceof errors_1.CustomServerError ? err : new errors_1.CustomServerError();
    console.log({ ERRRORRR: error });
    res.status(error.statusCode).json({
        error: {
            code: error.error_code,
            message: error.name,
            description: error.message,
            stack: process.env.NODE_ENV === "DEV" ? err.stack : undefined,
        },
    });
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    (0, db_1.default)()
        .then(() => {
        console.log("Database connected");
    })
        .catch((err) => {
        console.error("Error connecting to database", err);
    });
    (0, redis_1.default)()
        .then(() => {
        console.log("Redis connected");
    })
        .catch((err) => {
        console.error("Error connecting to redis", err);
    });
});
//# sourceMappingURL=server.js.map