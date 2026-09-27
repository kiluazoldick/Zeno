import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL n'est pas définie");
}

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  advanced: {
    database: {
      generateId: "uuid",
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  user: {
    modelName: "members",

    fields: {
      name: "nom",
      email: "email",
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
      image: "avatar_url",
    },

    additionalFields: {
      prenom: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
      },
      equipe: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },

  plugins: [nextCookies()],
});