import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

export type JwtPayload = {
  sub: string;
  email: string;
  name?: string;
};

const JWT_SECRET: Secret = (process.env.JWT_SECRET || "") as Secret;
if (!JWT_SECRET) {
  // Do not throw at import-time in case of test builds; runtime will still fail cleanly
  console.warn("JWT_SECRET is not set; tokens will fail to sign/verify.");
}

export function signToken(payload: JwtPayload, expiresIn: string | number = "7d") {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload as object, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
