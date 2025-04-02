import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

type Props = {
	onSubmitResponse: (response: string) => void;
};

const ResponseBar = ({ onSubmitResponse }: Props) => {
	const [response, setResponse] = useState('');

	const handleSendResponse = () => {
		if (response) {
			onSubmitResponse(response);
			setResponse('');
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSendResponse();
		}
	};

	return (
		<div className='absolute bottom-6 h-auto gap-3 rounded-lg py-3 px-5 bg-[var(--color-light-gray)] flex items-end justify-between w-[48rem]'>
			<textarea
				className='focus:outline-none min-h-[1lh] max-h-[10lh] w-full field-sizing-content resize-none'
				placeholder='Type a response here'
				rows={5}
				onChange={(e) => setResponse(e.target.value)}
				onKeyDown={handleKeyDown}
				value={response}
			></textarea>
			<button
				onClick={() => handleSendResponse()}
				className='hover:bg-[#606060] transition-colors duration-200 cursor-pointer border-2 border-[var(--color-accent)] w-8 h-8 rounded-xl'
			>
				<FontAwesomeIcon icon={faArrowUp} size='lg' />
			</button>
		</div>
	);
};

export default ResponseBar;
