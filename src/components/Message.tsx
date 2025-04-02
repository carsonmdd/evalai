import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

type Props = {
	sender: string;
	text: string;
	image: string;
};

const Message = ({ sender, text, image }: Props) => {
	return (
		<div
			className={`flex items-center justify-center gap-3 mb-7 ${
				sender === 'ai' ? 'self-start' : 'self-end flex-row-reverse'
			}`}
		>
			<img
				src={image}
				alt={`${sender} avatar`}
				className='w-10 h-10 rounded-full'
			/>
			<div
				className={`max-w-[40rem] rounded-xl p-3 ${
					sender === 'ai'
						? 'bg-indigo-800'
						: 'bg-[var(--dark-purple)]'
				}`}
			>
				{sender === 'ai' ? (
					<Typewriter words={[text]} typeSpeed={8} />
				) : (
					<div>{text}</div>
				)}
			</div>
		</div>
	);
};

export default Message;
