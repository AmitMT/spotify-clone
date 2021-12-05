import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import SpotifyProvider from 'next-auth/providers/spotify';

import spotifyApi, { LOGIN_URL } from '../../../lib/spotify';

const refreshAccessToken = async (token: JWT) => {
	try {
		spotifyApi.setAccessToken(token.accessToken as string);
		spotifyApi.setRefreshToken(token.refreshToken as string);

		const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

		return {
			...token,
			accessToken: refreshedToken.access_token,
			accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
			refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
		};
	} catch (error) {
		return { ...token, error: 'RefreshAccessTokenError' };
	}
};

export default NextAuth({
	providers: [
		SpotifyProvider({
			clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
			clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
			authorization: LOGIN_URL,
		}),
	],
	secret: process.env.JWT_SECRET as string,
	pages: {
		signIn: '/login',
	},
	callbacks: {
		async jwt({ token, account, user }) {
			// initial sign in
			if (account && user)
				return {
					...token,
					accessToken: account.access_token,
					refreshToken: account.refresh_token,
					username: account.providerAccountId,
					accessTokenExpires: (account.expires_at as number) * 1000,
				};

			// Return previous token if access token is still valid
			if (Date.now() < (token.accessTokenExpires as number)) return token;

			// Access token has expired - refresh it
			return refreshAccessToken(token);
		},

		async session({ session, token }) {
			const newSession = session;
			newSession.myUser = {
				accessToken: token.accessToken,
				refreshToken: token.refreshToken,
				username: token.username,
			};
			return newSession;
		},
	},
});
