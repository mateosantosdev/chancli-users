import express, { Request, Response, NextFunction } from "express";
import { UserRoles } from "./usersTypes";

import {
  all,
  getById,
  login,
  logout,
  profile,
  register,
  updateOwnEmail,
  updateOwnPassword,
} from "./usersController";

export const usersRoute = express.Router();

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const session = req.session;

  if (!session || !session.user || session.user.role !== UserRoles.ADMIN) {
    res.status(401).json("You are not allowed to access to this resource");
    return;
  }
  next();
};

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = req.session;

  if (!session || !session.user) {
    res.status(401).json("You are not identified");
    return;
  }
  next();
};

// Admin routes
usersRoute.get("/", isAdmin, all);
usersRoute.get("/get/:userId", isAdmin, getById);

// Authenticated routes
usersRoute.get("/logout", isAuthenticated, logout);
usersRoute.get("/profile", isAuthenticated, profile);
usersRoute.post("/updateOwnEmail", isAuthenticated, updateOwnEmail);
usersRoute.post("/updateOwnPassword", isAuthenticated, updateOwnPassword);

// Not authenticated routes
usersRoute.post("/login", login);
usersRoute.post("/register", register);

//usersRoute.post("/demo", createDemo);

export default usersRoute;
