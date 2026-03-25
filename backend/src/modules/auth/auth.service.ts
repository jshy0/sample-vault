import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { AuthRepository } from "./auth.repository";
import { RegisterDTO, LoginDTO } from "./auth.schema";
import { JwtPayload } from "./auth.types";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "1d";

export const AuthService = {
  async register(data: RegisterDTO) {
    const [existingEmail, existingUsername] = await Promise.all([
      AuthRepository.findByEmail(data.email),
      AuthRepository.findByUsername(data.username),
    ]);

    if (existingEmail || existingUsername) {
      const err = Object.assign(
        new Error("An account with those credentials already exists."),
        { status: 409 },
      );
      throw err;
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await AuthRepository.create(
      randomUUID(),
      data.email,
      data.username,
      passwordHash,
    );

    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });
    return { token };
  },

  async login(data: LoginDTO) {
    const user = await AuthRepository.findByEmail(data.email);

    if (!user) {
      const err = Object.assign(new Error("Invalid credentials"), {
        status: 401,
      });
      throw err;
    }

    const valid = await bcrypt.compare(data.password, user.password_hash);
    if (!valid) {
      const err = Object.assign(new Error("Invalid credentials"), {
        status: 401,
      });
      throw err;
    }
    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });
    return { token };
  },

  async getUserById(id: string) {
    return await AuthRepository.findById(id);
  },
};

function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
