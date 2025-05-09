import Image from 'next/image';
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
			<Image
				src={image}
				width={40}
				height={40}
				alt={`${sender} avatar`}
				className='rounded-full'
			/>
			<div
				className={`w-full max-w-[90%] rounded-xl p-3 break-words text-sm sm:text-base ${
					sender === 'ai' ? 'bg-indigo-700' : 'bg-violet-700'
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
