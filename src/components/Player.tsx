import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import {
	ReplyIcon,
	SwitchHorizontalIcon,
	VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline';
import {
	PauseIcon,
	PlayIcon,
	RewindIcon,
	FastForwardIcon,
	VolumeUpIcon,
} from '@heroicons/react/solid';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import ReactLoading from 'react-loading';
import { useRecoilState } from 'recoil';

import { errorState } from '../atoms/errorAtom';
import { currentTrackIdState, isPlayingState, PlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

export interface PlayerProps {}

const Player: FC<PlayerProps> = ({ ...props }) => {
	const { data: session } = useSession();
	const spotifyApi = useSpotify();
	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(-1);
	const songInfo = useSongInfo();
	const [, setError] = useRecoilState(errorState);
	const [shuffle, setShuffle] = useState(false);

	const songInfoRef = useRef(songInfo);
	const spotifyApiRef = useRef(spotifyApi);

	const fetchCurrentSong = useCallback(async () => {
		setIsPlaying(PlayingState.Loading);

		if (!songInfoRef.current) {
			setCurrentTrackId(
				(await spotifyApiRef.current.getMyCurrentPlayingTrack()).body?.item?.id || null,
			);

			setIsPlaying(
				(await spotifyApiRef.current.getMyCurrentPlaybackState()).body?.is_playing
					? PlayingState.Playing
					: PlayingState.Paused,
			);
		}
	}, [setCurrentTrackId, setIsPlaying]);

	useEffect(() => {
		if (spotifyApi.getAccessToken() && !currentTrackId) {
			fetchCurrentSong();
		}
	}, [currentTrackId, spotifyApi, session, fetchCurrentSong]);

	const handlePlayPause = useCallback(async () => {
		setIsPlaying(PlayingState.Loading);
		if ((await spotifyApi.getMyCurrentPlaybackState()).body?.is_playing) {
			await spotifyApi.pause();
			setIsPlaying(PlayingState.Paused);
		} else {
			spotifyApi.play();
			setIsPlaying(PlayingState.Playing);
		}
	}, [spotifyApi, setIsPlaying]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedAdjustVolume = useCallback(
		debounce((newVolume) => {
			spotifyApi.setVolume(newVolume).catch(() => {
				setError({
					title: 'No Device Found',
					message: 'Please activate spotify on your computer.',
				});
			});
		}, 500),
		[spotifyApi],
	);

	useEffect(() => {
		if (volume !== -1) debouncedAdjustVolume(volume);
	}, [volume, debouncedAdjustVolume]);

	return (
		<div
			className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8"
			{...props}
		>
			{/* Left */}
			<div className="flex items-center space-x-4">
				{songInfo?.album?.images?.[0]?.url && (
					<img
						src={songInfo?.album?.images?.[0]?.url}
						alt=""
						className="hidden md:block h-10 w-10"
					/>
				)}
				<div>
					<h3>{songInfo?.name}</h3>
					<div className="text-gray-500">{songInfo?.artists?.[0]?.name}</div>
				</div>
			</div>

			{/* Center */}
			<div className="flex items-center justify-center">
				<div className="flex-1 flex items-center justify-evenly max-w-md">
					<button
						className="transition-transform transform duration-100 ease-out hover:scale-125 active:!scale-100"
						onClick={() => {
							spotifyApi
								.setShuffle(!shuffle)
								.then(() => setShuffle(!shuffle))
								.catch(() => {
									setError({
										title: 'No Device Found',
										message: 'Please activate spotify on your computer.',
									});
								});
						}}
					>
						<SwitchHorizontalIcon
							className={`w-5 h-5 transition-colors ${shuffle && 'text-green-500'}`}
						/>
					</button>
					<button className="transition-transform transform duration-100 ease-out hover:scale-125 active:!scale-100">
						<RewindIcon className="w-5 h-5" />
					</button>

					{isPlaying === PlayingState.Playing && (
						<button
							onClick={handlePlayPause}
							className="transition-transform transform duration-100 ease-out hover:scale-125 active:!scale-100"
						>
							<PauseIcon className="w-10 h-10" />
						</button>
					)}
					{isPlaying === PlayingState.Loading && (
						<button
							onClick={handlePlayPause}
							className="transition-transform transform duration-100 ease-out hover:scale-125 active:!scale-100"
						>
							<ReactLoading type="spin" color="#fff" width="40px" height="40px" />
						</button>
					)}
					{isPlaying === PlayingState.Paused && (
						<button
							onClick={handlePlayPause}
							className="transition-transform transform duration-100 ease-out hover:scale-125 active:!scale-100"
						>
							<PlayIcon className="w-10 h-10" />
						</button>
					)}

					<button className="transition-transform transform duration-100 ease-out hover:scale-125 active:!scale-100">
						<FastForwardIcon className="w-5 h-5" />
					</button>
					<button className="transition-transform transform duration-100 ease-out hover:scale-125 active:!scale-100">
						<ReplyIcon className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Right */}
			<div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
				<button
					className="transition-transform transform duration-100 ease-out hover:scale-125 active:!scale-100"
					onClick={() => volume >= 10 && setVolume(volume - 10)}
				>
					<VolumeDownIcon className="w-5 h-5" />
				</button>

				<input
					className="w-14 md:w-28"
					type="range"
					value={volume !== -1 ? volume : 50}
					onChange={(e) => setVolume(e.target.valueAsNumber)}
					min="0"
					max="100"
				/>

				<button
					className="transition-transform transform duration-100 ease-out hover:scale-125 active:!scale-100"
					onClick={() => volume <= 90 && setVolume(volume + 10)}
				>
					<VolumeUpIcon className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};

export default Player;
