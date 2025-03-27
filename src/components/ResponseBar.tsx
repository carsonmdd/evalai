import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = {};

const ResponseBar = (props: Props) => {
	return (
		<div className='absolute bottom-6 h-auto gap-3 rounded-lg py-3 px-5 bg-[var(--color-light-gray)] flex items-end justify-between w-[48rem]'>
			<textarea
				className='focus:outline-none min-h-[1lh] max-h-[10lh] w-full field-sizing-content resize-none'
				placeholder='Type a response here'
				rows={5}
			></textarea>
			<button className='cursor-pointer border-2 border-[var(--color-accent)] w-8 h-8 rounded-xl'>
				<FontAwesomeIcon icon={faArrowUp} size='lg' />
			</button>
		</div>
	);
};

export default ResponseBar;
