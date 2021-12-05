import { atom } from 'recoil';

type ModalError = { title: string; message: string };

export const errorState = atom<ModalError | null>({
	key: 'errorState',
	default: null,
});
