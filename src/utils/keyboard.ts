export const handleKeyDown = (
	event: React.KeyboardEvent<HTMLTextAreaElement>,
	callback: () => void
) => {
	if (event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault();
		callback();
	}
};
