import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { InactiveAccount, InvalidEmailPasswordError } from "./utils/error";
import { sendRequest } from "./utils/api";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                // call backend
                const res = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                    body: {
                        username: credentials.username,
                        password: credentials.password
                    }
                });
                //if only have data (statusCode: 200)
                if (+res.statusCode === 201) {
                    // result that is returned will be stored in 'user' valuable of callbacks
                    return {
                        _id: res.data?.user._id,
                        email: res.data?.user.email,
                        name: res.data?.user.name,
                        access_token: res.data?.access_token,
                    }
                }
                // resCode 400: Inactive Account
                else if (+res.statusCode === 401) {
                    throw new InvalidEmailPasswordError();
                }
                // resCode 401: Incorrect Password
                else if (+res.statusCode === 400) {
                    throw new InactiveAccount();
                }
                else {
                    throw new Error("Internal server error");
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    //  By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
    callbacks: {
        jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.user = (user as IUser)
            }
            return token
        },
        session({ session, token }) {
            (session.user as IUser) = token.user
            return session
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
    },
})