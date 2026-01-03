import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

// This is the edge-compatible auth config (no Prisma/database adapters)
export const authConfig: NextAuthConfig = {
    session: {
        strategy: "jwt",
    },
    providers: [GitHub],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            return true; // Allow all requests, handle auth in specific routes
        },
    },
};
