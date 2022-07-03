import CredentialsProvider from "next-auth/providers/credentials";

export default CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Password",
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      username: { label: "Username", type: "text", placeholder: "" },
      password: {  label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied
      const user = { id: 1, name: "J Smith", email: "jsmith@example.com" }
      try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_STEEDOS_ROOT_URL}/accounts/password/login`, {
          method: 'POST',
          body: JSON.stringify({ user: {email: credentials.email}, password: credentials.password })
        })
        const json = await res.json()

      } catch (e) {console.log(e)}

      if (user) {
        // Any object returned will be saved in `user` property of the JWT
        return user
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
        return null

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      }
    }
  })