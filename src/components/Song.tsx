import React, { FC } from 'react';

import ReactLoading from 'react-loading';
import { useRecoilState } from 'recoil';

import { errorState } from '../atoms/errorAtom';
import { currentTrackIdState, isPlayingState, PlayingState } from '../atoms/songAtom';
import spotifyApi from '../lib/spotify';
import { millisecondsToMinutesAndSeconds } from '../lib/time';

export interface SongProps {
	track: SpotifyApi.TrackObjectFull;
	order: number;
}

const Song: FC<SongProps> = ({
	track: { album, name, artists, duration_ms, id, uri },
	order,
	...props
}) => {
	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
	const [, setIsPlaying] = useRecoilState(isPlayingState);
	const [, setError] = useRecoilState(errorState);

	const playSong = () => {
		spotifyApi
			.play({
				uris: [uri],
			})
			.then(() => {
				setIsPlaying(PlayingState.Playing);
			})
			.catch(() => {
				setError({ title: 'No Device Found', message: 'Please activate spotify on your device.' });
				setIsPlaying(PlayingState.Paused);
			});
		setCurrentTrackId(id);
		setIsPlaying(PlayingState.Loading);
	};

	return (
		<button
			className="flex items-center space-x-4 px-5 py-4 rounded-xl cursor-pointer transition-all sm:hover:bg-gray-900 active:!bg-[#222a3a] text-left"
			onClick={playSong}
			{...props}
		>
			<div className="flex-1 flex items-center space-x-4 min-w-0 ">
				<div className={`transition-all ${currentTrackId === id && 'text-green-500 font-bold'}`}>
					{currentTrackId === id ? (
						<ReactLoading type="bars" color="#10b981" width="30px" height="30px" />
					) : (
						<div>{order + 1}</div>
					)}
				</div>
				{album.images[0]?.url && (
					<img src={album.images[0]?.url} alt="song picture" className="w-10 h-10" />
				)}
				<div className="min-w-0">
					<div
						className={`truncate transition-colors duration-700 ${
							currentTrackId === id && 'text-green-500 font-bold'
						}`}
					>
						{name}
					</div>
					<div>{artists[0]?.name}</div>
				</div>
			</div>

			<div className="md:flex-1 flex items-center justify-end md:justify-between min-w-0 space-x-4 text-gray-600">
				<div className="hidden md:block truncate">{album.name}</div>
				<div>{millisecondsToMinutesAndSeconds(duration_ms)}</div>
			</div>
		</button>
	);
};

export default Song;
