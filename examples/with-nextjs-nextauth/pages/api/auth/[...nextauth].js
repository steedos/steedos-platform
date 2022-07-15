import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    KeycloakProvider({
        clientId: process.env.KEYCLOAK_ID,
        clientSecret: process.env.KEYCLOAK_SECRET,
        issuer: process.env.KEYCLOAK_ISSUER,
        name: 'Steedos ID'
    })
  ],
  session: {
    strategy: "jwt",
  }
})