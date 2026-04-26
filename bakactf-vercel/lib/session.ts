import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: number;
  username?: string;
  role?: string;
  adminLoggedIn?: boolean;
  adminUser?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "bakactf-super-secret-key-change-this-32chars",
  cookieName: "bakactf_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};
