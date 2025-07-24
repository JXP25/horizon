import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";
import AppDataSource from "../lib/db";
import { User } from "../entities/horizonUser";

const JWT_SECRET = "$uperM@n@123";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }

  public static getUserById(id: string) {
    return AppDataSource.getRepository(User).findOne({ where: { id } });
  }
  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
  
    const user = await UserService.getUserByEmail(email);
    if (!user) throw new Error("user not found");

    const userSalt = user.salt;
    const usersHashPassword = UserService.generateHash(userSalt, password);

    if (usersHashPassword !== user.password)
      throw new Error("Incorrect Password");

    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }

  public static async createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;

    const salt = randomBytes(32).toString("hex");
    const hashedPassword = UserService.generateHash(salt, password);

    const userRepo = AppDataSource.getRepository(User);
    const user = userRepo.create({
      firstName,
      lastName,
      email,
      salt,
      password: hashedPassword,
    });

    const savedUser = await userRepo.save(user);
    if (!savedUser) throw new Error("Error creating user");

    return UserService.getUserToken({ email, password });
  }

  private static getUserByEmail(email: string) {
    return AppDataSource.getRepository(User).findOne({ where: { email } });
  }

  public static async decodeJWTToken(token: string) {
    return JWT.verify(token, JWT_SECRET);
  }
}

export default UserService;
