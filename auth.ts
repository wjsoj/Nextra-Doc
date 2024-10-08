import NextAuth from "next-auth";
import Authentik from "next-auth/providers/authentik";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Authentik({
    allowDangerousEmailAccountLinking: true,
    clientId: process.env.AUTH_AUTHENTIK_CLIENT_ID,
    clientSecret: process.env.AUTH_AUTHENTIK_CLIENT_SECRET,
    issuer: process.env.AUTH_AUTHENTIK_ISSUER,
  })],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});