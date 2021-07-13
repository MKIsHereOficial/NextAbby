import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { PouchDBAdapter } from "@next-auth/pouchdb-adapter"
import PouchDB from "pouchdb"

// Setup your PouchDB instance and database
PouchDB
  .plugin(require("pouchdb-adapter-leveldb"))   // Any other adapter
  .plugin(require("pouchdb-find"))              // Don't forget the `pouchdb-find` plugin
  
const pouchdb = new PouchDB("auth_db", { adapter: "leveldb" })

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    }),
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
      if (user && user.id && user.id.length >= "765002665041068033".length) return `/${user.id}/dashboard`;

      return false;
    },
    async redirect(url, baseUrl) {
      return url.startsWith(baseUrl)
      ? url
      : baseUrl
    },

  },
  adapter: PouchDBAdapter(pouchdb),
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: false,
  
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  
    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 48 * 60 * 60, // 48 hours
  }
});