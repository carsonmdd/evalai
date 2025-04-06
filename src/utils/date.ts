export const formatTime = (time: Date) => {
	return new Date(time).toLocaleString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
};
