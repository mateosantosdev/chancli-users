import { v4 as uuidv4 } from "uuid";
import { DBDataSource } from "../db/db";
import { User } from "../entity/user";
import { hash } from "bcrypt";
import { UserRoles, UserUpdateParams } from "./usersTypes";

const userRepository = DBDataSource.getRepository(User);

const saltRounds = 10;

export class UserApi {
  createDemo = async (): Promise<User> =>
    await userRepository.save({
      id: uuidv4(),
      email: "klianmail@gmail.com",
      password: await hash("password", saltRounds),
      role: UserRoles.ADMIN,
    });
  getAll = async (): Promise<User[]> => await userRepository.find();

  getById = async (id: string): Promise<User | null> =>
    await userRepository.findOneBy({ id });

  getByEmail = async (email: string): Promise<User | null> =>
    await userRepository.findOneBy({ email });

  register = async (email: string, password: string): Promise<User | null> =>
    await userRepository.save({
      id: uuidv4(),
      email: email,
      password: await hash(password, saltRounds),
      role: UserRoles.NORMAL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  update = async (params: UserUpdateParams): Promise<User | null> => {
    if (params.email) {
      await userRepository.update(params.id, {
        email: params.email,
        updatedAt: new Date(),
      });
    }

    if (params.password) {
      await userRepository.update(params.id, {
        password: await hash(params.password, saltRounds),
        updatedAt: new Date(),
      });
    }
    return await userRepository.findOneByOrFail({ id: params.id });
  };
}
