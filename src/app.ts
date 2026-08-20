import cookieParser from "cookie-parser";
import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import config from "./config";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { postRouter } from "./modules/post/post.routes";
import { commentsRouter } from "./modules/comments/comment.routes";
import { notFound } from "./middlewares/notFound";
import HttpStatus from "http-status"
import { errorHandler } from "./middlewares/globalErrorHandeller";


const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});


app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/post", postRouter)
app.use("/api/comment", commentsRouter)

app.use(notFound)

app.use(errorHandler)

export default app;
