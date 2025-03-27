'use client';

import Message from '@/components/Message';
import ResponseBar from '@/components/ResponseBar';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

type Props = {};

const Interview = (props: Props) => {
	const [interviewStarted, setInterviewStarted] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [jobDescription, setJobDescription] = useState('');
	const chatContainerRef = useRef<HTMLDivElement | null>(null);

	const messages = [
		{
			text: 'Tell me about a time you had to learn a new technology quickly. How did you approach it, and what was the outcome?',
			sender: 'ai',
		},
		{
			text: 'I had to learn tRPC for Dionysus and it was really difficult.',
			sender: 'user',
		},
		{
			text: 'Tell me about a time you had to learn a new technology quickly. How did you approach it, and what was the outcome?',
			sender: 'ai',
		},
		{
			text: 'I had to learn tRPC for Dionysus and it was really difficult.',
			sender: 'user',
		},
		{
			text: 'Tell me about a time you had to learn a new technology quickly. How did you approach it, and what was the outcome?',
			sender: 'ai',
		},
		{
			text: 'I had to learn tRPC for Dionysus and it was really difficult.',
			sender: 'user',
		},
		{
			text: 'Tell me about a time you had to learn a new technology quickly. How did you approach it, and what was the outcome?',
			sender: 'ai',
		},
		{
			text: 'I had to learn tRPC for Dionysus and it was really difficult.',
			sender: 'user',
		},
		{
			text: 'Tell me about a time you had to learn a new technology quickly. How did you approach it, and what was the outcome?',
			sender: 'ai',
		},
		{
			text: 'I had to learn tRPC for Dionysus and it was really difficult.',
			sender: 'user',
		},
		{
			text: 'Tell me about a time you had to learn a new technology quickly. How did you approach it, and what was the outcome?',
			sender: 'ai',
		},
		{
			text: 'I had to learn tRPC for Dionysus and it was really difficult.',
			sender: 'user',
		},
		{
			text: 'TESTINGGG',
			sender: 'user',
		},
	];

	const handleStartInterview = async () => {
		const response = await axios.post('/api/generateQuestions', {
			jobDescription,
		});

		setQuestions(response.data.questions);
		setInterviewStarted(true);
	};

	useEffect(() => {
		const chatContainer = chatContainerRef.current;
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}, [messages]);

	return (
		<>
			{!interviewStarted ? (
				<div className='grow flex flex-col items-center justify-center'>
					<h1 className='font-bold text-3xl mb-6'>Job Description</h1>
					<textarea
						className='bg-[var(--color-light-gray)] mb-12 border border-white rounded-xl w-[45rem] h-[30rem] p-5 text-xl'
						placeholder='Paste a job description here'
						onChange={(e) => setJobDescription(e.target.value)}
					></textarea>
					<button
						onClick={handleStartInterview}
						className='cursor-pointer bg-[var(--color-accent)] hover:bg-[var(--color-light-purple)] rounded text-2xl px-4 py-1'
					>
						Begin Interview
					</button>
				</div>
			) : (
				<div className='grow flex flex-col items-center justify-end pb-20 relative'>
					<div
						ref={chatContainerRef}
						className='w-[48rem] h-[48rem] mb-4 flex flex-col overflow-y-auto'
					>
						{messages.map((msg, index) => (
							<Message
								key={index}
								sender={msg.sender}
								text={msg.text}
							/>
						))}
					</div>
					<ResponseBar />
				</div>
			)}
		</>
	);
};

export default Interview;
