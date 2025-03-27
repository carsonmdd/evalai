'use client';

import Message from '@/components/Message';
import ResponseBar from '@/components/ResponseBar';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

type Props = {};

const Interview = (props: Props) => {
	/*
		AI sends question
		User responds
		Save question/response in database
		Repeat until all questions answered
		Generate and save report
			For each question, generate score, strengths, improvements

	*/

	const [interviewStarted, setInterviewStarted] = useState(false);
	const [questions, setQuestions] = useState<string[]>([]);
	const [responses, setResponses] = useState<string[]>([]);
	const [messages, setMessages] = useState<
		{ sender: string; text: string }[]
	>([]);
	const [jobDescription, setJobDescription] = useState('');
	const chatContainerRef = useRef<HTMLDivElement | null>(null);

	const handleStartInterview = async () => {
		const response = await axios.post('/api/generateQuestions', {
			jobDescription,
		});

		setQuestions(response.data.questions);
		messages.push({
			sender: 'ai',
			text: response.data.questions[0],
		});
		setInterviewStarted(true);
	};

	const handleResponseSubmit = (response: string) => {
		setResponses((prevResponses) => [...prevResponses, response]);

		setMessages((prevMessages) => [
			...prevMessages,
			{ sender: 'user', text: response },
		]);
	};

	useEffect(() => {
		const chatContainer = chatContainerRef.current;
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}, [questions, responses]);

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
					<ResponseBar onSubmitResponse={handleResponseSubmit} />
				</div>
			)}
		</>
	);
};

export default Interview;
