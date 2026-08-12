import cookieParser from "cookie-parser";
import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import config from "./config";
import HttpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt"

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


app.post("/api/users/register", (async (req: Request, res: Response) => {
  const { name, email, password, profilePhoto } = req.body;


  const isUserExist = await prisma.user.findUnique({
    where: { email }
  })

  if (isUserExist) {
    throw new Error("user already exist please signIn Now")
  }

  const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword
    }
  })

  await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto
    }
  })

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email
    }
  })

  res.status(HttpStatus.CREATED).json({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "user registration successful",
    data: { user }
  })

}))

export default app;
