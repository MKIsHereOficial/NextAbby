import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import * as Fauna from "faunadb"
import { FaunaAdapter } from "@next-auth/fauna-adapter"

const client = new Fauna.Client({
  secret: process.env.FAUNADB_KEY,
  scheme: "http",
  domain: "localhost",
  port: 8443,
})

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    }),
    Providers.Credentials({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Discord Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      discordID: { label: "ID", type: "text", placeholder: "852948164977098753" },
    },
    async authorize(credentials, req) {
      // You need to provide your own logic here that takes the credentials
      // submitted and returns either a object representing a user or value
      // that is false/null if the credentials are invalid.
      // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
      // You can also use the `req` object to obtain additional parameters
      // (i.e., the request IP address) 
      if (!credentials['discordID']) return null;

      const res = await fetch(`https://discord.com/api/v9/users/${credentials['discordID']}`, {
        headers: { "Content-Type": "application/json", "Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}` }
      })
      const user = await res.json();
      
      // If no error and we have user data, return it
      if (res.ok && user) {
        return user;
      }
      // Return null if user data could not be retrieved
      return null;
    }
  })
    // ...add more providers here
  ],
  callbacks: {
    /**
   * @param  {object} user     User object
   * @param  {object} account  Provider account
   * @param  {object} profile  Provider profile 
   * @return {boolean|string}  Return `true` to allow sign in
   *                           Return `false` to deny access
   *                           Return `string` to redirect to (eg.: "/unauthorized")
   */
    async signIn(user, account, profile) {
      console.log(user && user.id && user.id.length >= "852948164977098753".length ? "valid user" : "invalid user");

      if (user && user.id && user.id.length >= "852948164977098753".length) return true;
      //if (user && user.id && user.id.length >= "852948164977098753".length) return `/${user.id}/dashboard`;

      return false;
    },
    async redirect(url, baseUrl) {
      return url.startsWith(baseUrl)
      ? url
      : baseUrl
    },
    /**
   * @param  {object}  token     Decrypted JSON Web Token
   * @param  {object}  user      User object      (only available on sign in)
   * @param  {object}  account   Provider account (only available on sign in)
   * @param  {object}  profile   Provider profile (only available on sign in)
   * @param  {boolean} isNewUser True if new user (only available on sign in)
   * @return {object}            JSON Web Token that will be saved
   */
  async jwt(token, user, account, profile, isNewUser) {
    // Add access_token to the token right after signin
    if (account?.accessToken) {
      token.accessToken = account.accessToken
    }
    if (user) {
      token.id = token.email = user.id;
      token.name = user.username;
      token.discriminator = user.discriminator;
      token.picture = user.avatar;
    }
    return token
  }

  },
  adapter: FaunaAdapter({ faunaClient: client}),
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,
  
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  
    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 48 * 60 * 60, // 48 hours
  }
});