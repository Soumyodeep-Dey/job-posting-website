import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use the edge-compatible auth config for middleware
export const { auth: middleware } = NextAuth(authConfig);