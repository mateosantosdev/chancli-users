import express, { Request, Response, NextFunction } from 'express';
import { UserRoles } from './usersTypes';
import { UserApi } from './usersApi';
import jwt from 'jsonwebtoken';

export interface CustomRequest extends Request {
    user?: User;
}

import {
    all,
    getById,
    login,
    logout,
    profile,
    register,
    updateOwnEmail,
    updateOwnPassword
} from './usersController';
import { User } from '../entity/user';

export const usersRoute = express.Router();

const FORBIDDEN_MESSAGE = 'You are not allowed to access to this resource';
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session;
    if (session && session.user && session.user.role === UserRoles.ADMIN) {
        next();
        return;
    }

    // Check for JWT
    const userFromBearerToken: User | null = await getBearerToken(req);
    if (!userFromBearerToken || userFromBearerToken.role !== UserRoles.ADMIN) {
        res.status(401).json(FORBIDDEN_MESSAGE);
        return;
    }
    req.user = userFromBearerToken;

    next();
};

const isAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const session = req.session;
    const bearerToken = getBearerToken(req);
    if ((!session || !session.user) && !bearerToken) {
        res.status(401).json('You are not identified');
        return;
    }

    // Check for JWT
    const userFromBearerToken: User | null = await getBearerToken(req);
    if (!userFromBearerToken) {
        res.status(401).json(FORBIDDEN_MESSAGE);
        return;
    }
    req.user = userFromBearerToken;

    next();
};

const getBearerToken = async (req: CustomRequest): Promise<User | null> => {
    try {
        if (req.headers.authorization) {
            const bearer = req.headers.authorization.split(' ');
            const decoded: any = jwt.verify(
                bearer[1],
                process.env.SESSION_SECRET || 'missing Session Secret'
            );

            const userService = new UserApi();
            const user: User | null = await userService.getById(decoded.id);
            if (user) {
                return user;
            }
        } else {
            throw 'Missing bearer token';
        }
    } catch (error: any) {
        console.log(error.message);
    }
    return null;
};

// Admin routes
usersRoute.get('/', isAdmin, all);
usersRoute.get('/get/:userId', isAdmin, getById);

// Authenticated routes
usersRoute.get('/logout', isAuthenticated, logout);
usersRoute.get('/profile', isAuthenticated, profile);
usersRoute.post('/updateOwnEmail', isAuthenticated, updateOwnEmail);
usersRoute.post('/updateOwnPassword', isAuthenticated, updateOwnPassword);

// Not authenticated routes
usersRoute.post('/login', login);
usersRoute.post('/register', register);

//usersRoute.post("/demo", createDemo);

export default usersRoute;
