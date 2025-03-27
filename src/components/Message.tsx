import React from 'react';

type Props = {
	sender: string;
	text: string;
};

const Message = ({ sender, text }: Props) => {
	return (
		<div
			className={` max-w-[40rem] mb-7 rounded-xl p-3 ${
				sender === 'ai'
					? 'self-start bg-indigo-800'
					: 'self-end bg-[var(--dark-purple)]'
			}`}
		>
			{text}
		</div>
	);
};

export default Message;
