import React, { FC, useEffect, useState } from 'react';

import {
	HomeIcon,
	SearchIcon,
	LibraryIcon,
	PlusCircleIcon,
	HeartIcon,
	RssIcon,
	LoginIcon,
} from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';

import { playlistIdState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';

export interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({ ...props }) => {
	const spotifyApi = useSpotify();
	const { data: session } = useSession();

	const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
	const [, setPlaylistId] = useRecoilState(playlistIdState);

	useEffect(() => {
		if (spotifyApi.getAccessToken())
			spotifyApi.getUserPlaylists().then(({ body: { items } }) => {
				setPlaylists(items);
			});
	}, [session, spotifyApi]);

	return (
		<div
			className="hidden md:block flex-col text-gray-600 p-5 text-xs lg:text-sm border-r border-gray-900 divide-y divide-gray-900 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-900 sm:max-w-[12rem] lg:max-w-[15rem]"
			{...props}
		>
			<div className="flex flex-col pt-2 mt-2">
				<button
					className="flex-1 flex items-center space-x-2 p-2 transition-colors hover:text-white text-left"
					onClick={() => signOut()}
				>
					<LoginIcon className="w-5 h-5" />
					<div className="flex-1 truncate">Logout</div>
				</button>
			</div>

			<div className="flex flex-col pt-2 mt-2">
				<button className="flex-1 flex items-center space-x-2 p-2 transition-colors hover:text-white text-left">
					<HomeIcon className="w-5 h-5" />
					<div className="flex-1 truncate">Home</div>
				</button>
				<button className="flex-1 flex items-center space-x-2 p-2 transition-colors hover:text-white text-left">
					<SearchIcon className="w-5 h-5" />
					<div className="flex-1 truncate">Search</div>
				</button>
				<button className="flex-1 flex items-center space-x-2 p-2 transition-colors hover:text-white text-left">
					<LibraryIcon className="w-5 h-5" />
					<div className="flex-1 truncate">Your Library</div>
				</button>
			</div>

			<div className="flex flex-col pt-2 mt-2">
				<button className="flex-1 flex items-center space-x-2 p-2 transition-colors hover:text-white text-left">
					<PlusCircleIcon className="w-5 h-5" />
					<div className="flex-1 truncate">Create Playlist</div>
				</button>
				<button className="flex-1 flex items-center space-x-2 p-2 transition-colors hover:text-white text-left">
					<HeartIcon className="w-5 h-5" />
					<div className="flex-1 truncate">Liked Songs</div>
				</button>
				<button className="flex-1 flex items-center space-x-2 p-2 transition-colors hover:text-white text-left">
					<RssIcon className="w-5 h-5" />
					<div className="flex-1 truncate">Your Episodes</div>
				</button>
			</div>

			{/* Playlists */}
			<div className="flex flex-col pt-2 mt-2">
				{playlists.map((playlist) => (
					<button
						key={playlist.id}
						className="flex-1 flex items-center space-x-2 p-2 transition-colors hover:text-white truncate text-left"
						onClick={() => setPlaylistId(playlist.id)}
					>
						{playlist.name}
					</button>
				))}
			</div>
		</div>
	);
};

export default Sidebar;
