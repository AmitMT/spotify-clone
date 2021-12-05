import SpotifyWebApi from 'spotify-web-api-node';

const scopes = [
	'user-read-email',
	'playlist-read-private',
	'playlist-read-collaborative',
	'streaming',
	'user-read-private',
	'user-library-read',
	'user-top-read',
	// 'user-library-modify',
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'user-read-recently-played',
	'user-follow-read',
].join(',');

const queryParamsString = new URLSearchParams({ scope: scopes });
export const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamsString.toString()}`;

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
	clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
});

export default spotifyApi;
