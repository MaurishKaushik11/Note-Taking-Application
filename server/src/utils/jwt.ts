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

export function signToken(payload: JwtPayload, expiresIn: number | string = "7d") {
  // jsonwebtoken v9 typings for `expiresIn` are stricter (StringValue/number). Cast to satisfy types.
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload as object, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
