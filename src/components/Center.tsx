import React, { FC, useEffect, useState } from 'react';

import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRecoilValue, useRecoilState } from 'recoil';

import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';

const colors = [
	'from-indigo-500',
	'from-blue-500',
	'from-green-500',
	'from-red-500',
	'from-yellow-500',
	'from-pink-500',
	'from-purple-500',
];

export interface CenterProps {}

const Center: FC<CenterProps> = ({ ...props }) => {
	const { data: session } = useSession();
	const router = useRouter();
	const spotifyApi = useSpotify();
	const [color, setColor] = useState('');
	const playlistId = useRecoilValue(playlistIdState);
	const [playlist, setPlaylist] = useRecoilState(playlistState);

	useEffect(() => {
		setColor(colors[Math.floor(Math.random() * colors.length)] as string);
	}, [playlistId]);

	useEffect(() => {
		if (playlistId) spotifyApi.getPlaylist(playlistId).then(({ body }) => setPlaylist(body));
	}, [spotifyApi, playlistId, setPlaylist]);

	return (
		<div
			className="flex-1 h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-900"
			{...props}
		>
			<header>
				<div className="absolute top-5 right-8 flex items-center space-x-3 bg-black rounded-full cursor-pointer p-1 pr-2 opacity-80 transition-opacity hover:opacity-100">
					<img
						src={session?.user?.image || `${router.basePath}/assets/default-avatar.jpg`}
						className="rounded-full w-10 h-10"
						alt=""
					/>
					<h1>{session?.user?.name}</h1>
					<ChevronDownIcon className="w-5 h-5" />
				</div>
			</header>

			<section className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black h-80 p-8`}>
				{playlist ? (
					<>
						<img
							className="w-44 h-44 shadow-2xl"
							src={playlist?.images?.[0]?.url || `${router.basePath}/assets/default-avatar.jpg`}
							alt="album picture"
						/>
						<div>
							<div className="mb-[-15px]">PLAYLIST</div>
							<h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
						</div>
					</>
				) : (
					<div className="text-2xl md:text-3xl xl:text-5xl font-bold justify-self-center">
						Please Select a Playlist
					</div>
				)}
			</section>

			<section className="p-8">
				<Songs />
			</section>
		</div>
	);
};

export default Center;
