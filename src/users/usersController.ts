import { Request, Response } from "express";
import { User } from "../entity/user";
import { UserApi } from "./usersApi";
import { compare } from "bcrypt";

const userService = new UserApi();

const MISSING_PARAMETERS_ERROR = "Missing parameters";

export const all = async (req: Request, res: Response) => {
  try {
    const users: User[] = await userService.getAll();
    res.json(users);
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json(MISSING_PARAMETERS_ERROR);
      return;
    }
    const user: User | null = await userService.getById(userId);
    res.json(user);
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json(MISSING_PARAMETERS_ERROR);
      return;
    }
    const userByEmail: User | null = await userService.getByEmail(email);

    if (!userByEmail) {
      res.status(401).json("User not found");
      return;
    }

    const validPassword = await compare(password, userByEmail.password!);
    if (!validPassword) {
      throw {
        code: 401,
        message: "Invalid password",
      };
    }

    const { id, email: userEmail, role } = userByEmail;
    req.session.user = {
      id,
      email: userEmail,
      role,
    };

    res.json(userByEmail);
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const createDemo = async (req: Request, res: Response) =>
  await userService.createDemo();

export const register = async (req: Request, res: Response) => {
  try {
    if (process.env.REGISTER_OPEN === "no" || !process.env.REGISTER_OPEN) {
      res.status(400).json("Registration is disabled");
      return;
    }

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json(MISSING_PARAMETERS_ERROR);
      return;
    }
    const userByEmail: User | null = await userService.getByEmail(email);

    if (userByEmail) {
      res.status(401).json("User exists");
      return;
    }

    const user = await userService.register(email, password);

    res.json(user);
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  const session = req.session;

  if (!session || !session.user) {
    res.status(401).json("User not found");
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  });

  res.json({success: true});
};

export const profile = async (req: Request, res: Response) => {
  try {
    if (!req.session.user?.id) {
      throw {
        code: 401,
        message: "Authentication required",
      };
    }
    const user: User | null = await userService.getById(req.session.user.id);
    if (!user) {
      throw {
        code: 404,
        message: "User not found",
      };
    }
    const { password, role, ...response } = user;
    res.json(response);
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const updateOwnEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw {
        code: 400,
        message: "Email required",
      };
    }
    const existingUser: User | null = await userService.getByEmail(email);
    if (existingUser && existingUser.id !== req.session.user!.id) {
      throw {
        code: 400,
        message: "This email is being used",
      };
    }

    const updatedUser: User | null = await userService.update({
      id: req.session.user!.id,
      email,
    });

    res.json({
      id: updatedUser?.id,
      email: updatedUser?.email,
    });
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const updateOwnPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (!password) {
      throw {
        code: 400,
        message: "Password required",
      };
    }

    const updatedUser: User | null = await userService.update({
      id: req.session.user!.id,
      password,
    });

    res.json({
      id: updatedUser?.id,
      email: updatedUser?.email,
    });
  } catch (error: any) {
    res.status(400).json(error);
  }
};
