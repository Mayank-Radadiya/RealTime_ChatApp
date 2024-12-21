import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { dbConnection } from "../database/DbConnection"; // Custom Redis database connection
import GoogleProvider from "next-auth/providers/google"; // Google OAuth provider for authentication
import { fetchRedis } from "@/helpers/redis";

// Function to fetch Google OAuth credentials from environment variables
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID; // Google Client ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET; // Google Client Secret

  // Ensure credentials are available, otherwise throw an error
  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  return { clientId, clientSecret }; // Return the credentials
}

// Configuration options for NextAuth
export const authOptions: NextAuthOptions = {
  // Use the Upstash Redis adapter for session and user persistence
  adapter: UpstashRedisAdapter(dbConnection),

  // Configure session strategy to use JSON Web Tokens (JWT)
  session: {
    strategy: "jwt",
  },

  // Custom Page routes
  pages: {
    signIn: "/login", // Set the custom login Page
  },

  // OAuth providers for authentication
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId, // Google Client ID
      clientSecret: getGoogleCredentials().clientSecret, // Google Client Secret
    }),
  ],

  // Custom callback functions for various authentication events
  callbacks: {
    // Modify the JWT token during creation and updates
    async jwt({ token, user }) {
      // Attempt to retrieve user from Redis using the token ID
      const dbUserResult = (await fetchRedis("get", `user:${token.id}`)) as
        | string
        | null;

      // If no user exists in Redis and a user object is available (on login)
      if (!dbUserResult) {
        if (user) {
          token.id = user!.id; // Assign user ID to the token
        }
        return token; // Return the updated token
      }
      const dbUser = JSON.parse(dbUserResult) as User;
      // If user exists in Redis, populate the token with user details
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },

    // Modify the session object before it is returned to the client
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; // Attach user ID to session
        session.user.name = token.name; // Attach user name to session
        session.user.email = token.email; // Attach user email to session
        session.user.image = token.picture; // Attach user image to session
      }
      return session; // Return the enriched session object
    },

    // Redirect users after a successful sign-in
    redirect() {
      return "/dashboard"; // Redirect to the dashboard
    },
  },
};
