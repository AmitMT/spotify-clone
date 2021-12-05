import { useEffect } from 'react';

import { useSession, signIn } from 'next-auth/react';

import spotifyApi from '../lib/spotify';

type MySession = { accessToken: string; refreshToken: string; username: string };

export interface UseSpotifyProps {}

const useSpotify = () => {
	const { data: session } = useSession();

	useEffect(() => {
		if (session) {
			if (session.error === 'RefreshAccessTokenError') signIn();

			spotifyApi.setAccessToken((session.myUser as MySession).accessToken);
		}
	}, [session]);

	return spotifyApi;
};

export default useSpotify;
