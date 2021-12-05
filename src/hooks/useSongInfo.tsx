import { useEffect, useState } from 'react';

import { useRecoilState } from 'recoil';

import { currentTrackIdState } from '../atoms/songAtom';
import useSpotify from './useSpotify';

export interface UseSongInfoProps {}

const useSongInfo = () => {
	const spotifyApi = useSpotify();
	const [currentTrackId] = useRecoilState(currentTrackIdState);
	const [songInfo, setSongInfo] = useState<SpotifyApi.TrackObjectFull | null>(null);

	useEffect(() => {
		const fetchSongInfo = async () => {
			if (spotifyApi === null || !currentTrackId) setSongInfo(null);
			else {
				setSongInfo(
					(await (
						await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`, {
							headers: { Authorization: `Bearer ${spotifyApi.getAccessToken()}` },
						})
					).json()) as SpotifyApi.TrackObjectFull,
				);
			}
		};
		fetchSongInfo();
	}, [currentTrackId, spotifyApi]);

	return songInfo;
};

export default useSongInfo;
