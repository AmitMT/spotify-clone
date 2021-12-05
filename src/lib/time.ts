export const millisecondsToMinutesAndSeconds = (milliseconds: number) => {
	const seconds = Math.floor((milliseconds / 1000) % 60);
	const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
	const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

	return `${hours === 0 ? '' : `${hours}:`}${
		// eslint-disable-next-line no-nested-ternary
		(hours !== 0 && minutes < 10 ? '0' : '') + minutes
	}:${(seconds < 10 ? '0' : '') + seconds}`;
};
