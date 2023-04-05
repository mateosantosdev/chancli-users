import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import usersRoute from "./users/usersRoutes";
import { DBDataSource } from "./db/db";

import session from "express-session";
import { UserSession } from "./users/usersTypes";
import { User } from "./entity/user";

declare module "express-session" {
  interface SessionData {
    user: UserSession;
  }
}

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

DBDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app: Express = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    saveUninitialized: true,
    cookie: {
      secure: process.env.ENVIRONMENT === "production",
      httpOnly: true,
      path: "/",
      maxAge: 3600000
    },
  })
);

const port = process.env.PORT;
app.get("/", (req: Request, res: Response) => {

  res.send("Express + TypeScript Server");
});

app.use("/api/users", usersRoute);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
