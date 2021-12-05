import React, { FC } from 'react';

import { useRecoilValue } from 'recoil';

import { playlistState } from '../atoms/playlistAtom';
import Song from './Song';

export interface SongsProps {}

const Songs: FC<SongsProps> = ({ ...props }) => {
	const playlist = useRecoilValue(playlistState);

	return (
		<div className="flex flex-col space-y-1" {...props}>
			{playlist?.tracks.items.map((song, i) => (
				<Song key={i} track={song.track} order={i} />
			))}
		</div>
	);
};

export default Songs;
