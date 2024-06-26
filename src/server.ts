import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import V1Router from "./routes/api/v1";
import { CustomServerError } from "./errors";
import getDB from "./config/db";
import getRedisInstance from "./config/redis";

const app = express();

const srcPath = __dirname;

console.log({ srcPath });

app.set("view engine", "ejs");
app.set("views", path.join(srcPath, "views"));
app.use(express.static(path.join(srcPath, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(
  helmet({
    xPoweredBy: false,
  })
);

app.use("/api/v1", V1Router);

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("pages/login");
});

app.use(
  (err: CustomServerError, req: Request, res: Response, next: NextFunction) => {
    const error =
      err instanceof CustomServerError ? err : new CustomServerError();

    console.log({ ERRRORRR: error });
    res.status(error.statusCode).json({
      error: {
        code: error.error_code,
        message: error.name,
        description: error.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
    });
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  getDB()
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.error("Error connecting to database", err);
    });

  getRedisInstance()
    .then(() => {
      console.log("Redis connected");
    })
    .catch((err) => {
      console.error("Error connecting to redis", err);
    });
});
