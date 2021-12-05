import { atom } from 'recoil';

export const currentTrackIdState = atom<string | null>({
	key: 'currentTrackIdState',
	default: null,
});

export enum PlayingState {
	Playing,
	Paused,
	Loading,
}

export const isPlayingState = atom({
	key: 'isPlayingState',
	default: PlayingState.Paused,
});
