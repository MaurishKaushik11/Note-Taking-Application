import jwt from "jsonwebtoken";

export type JwtPayload = {
  sub: string;
  email: string;
  name?: string;
};

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  // Do not throw at import-time in case of test builds; runtime will still fail cleanly
  console.warn("JWT_SECRET is not set; tokens will fail to sign/verify.");
}

export function signToken(payload: JwtPayload, expiresIn: string = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
