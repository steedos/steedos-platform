import KeycloakProvider from "next-auth/providers/keycloak";

export default KeycloakProvider({
    clientId: process.env.KEYCLOAK_ID,
    clientSecret: process.env.KEYCLOAK_SECRET,
    issuer: process.env.KEYCLOAK_ISSUER,
    name: 'Steedos ID'
})