import { handleKeyDown } from '@/utils/keyboard';
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

	return (
		<div className='fixed bottom-[1rem] gap-3 rounded-lg py-3 px-5 bg-[#26323b] flex items-end justify-between w-full max-w-[55rem]'>
			<textarea
				className='focus:outline-none min-h-[1lh] max-h-[10lh] w-full field-sizing-content resize-none'
				placeholder='Type a response here'
				rows={5}
				onChange={(e) => setResponse(e.target.value)}
				onKeyDown={(e) => handleKeyDown(e, handleSendResponse)}
				value={response}
			></textarea>
			<button
				onClick={() => handleSendResponse()}
				className='hover:bg-[#293640] transition-colors duration-200 cursor-pointer border-2 border-violet-500 w-8 h-8 rounded-xl'
			>
				<FontAwesomeIcon icon={faArrowUp} size='lg' />
			</button>
		</div>
	);
};

export default ResponseBar;
