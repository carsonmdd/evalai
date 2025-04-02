'use client';

import Message from '@/components/Message';
import ResponseBar from '@/components/ResponseBar';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const Interview = () => {
	const [interviewStarted, setInterviewStarted] = useState(false);
	const [interviewCompleted, setInterviewCompleted] = useState(false);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [questions, setQuestions] = useState<string[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [questionResponses, setQuestionResponses] = useState<
		{ question: string; response: string }[]
	>([]);
	const [messages, setMessages] = useState<
		{ sender: string; text: string }[]
	>([]);
	const [jobDescription, setJobDescription] = useState('');
	const [interviewId, setInterviewId] = useState('');

	const chatContainerRef = useRef<HTMLDivElement | null>(null);

	const handleStartInterview = async () => {
		try {
			const response = await axios.post('/api/generateQuestions', {
				jobDescription,
			});

			setQuestions(response.data.questions);
			sendMessage('ai', response.data.questions[0]);
			setInterviewStarted(true);
			setStartTime(new Date());
		} catch (e) {
			console.error('Failed to generate questions:', e);
		}
	};

	const handleResponseSubmit = async (response: string) => {
		sendMessage('user', response);

		const updatedResponses = [
			...questionResponses,
			{ question: questions[currentQuestionIndex], response },
		];
		setQuestionResponses(updatedResponses);
		if (currentQuestionIndex < questions.length - 1) {
			// Move to next question
			sendMessage('ai', questions[currentQuestionIndex + 1]);
			setCurrentQuestionIndex((prev) => prev + 1);
		} else {
			// Generate report
			sendMessage(
				'ai',
				'Thank you for completing the interview! I will generate feedback for you shortly.'
			);
			setInterviewCompleted(true);

			try {
				const response = await axios.post('/api/generateReport', {
					startTime,
					jobDesc: jobDescription,
					questionResponses: updatedResponses,
				});
				setInterviewId(response.data.interview.id);
			} catch (e) {
				console.error('Failed to generate report:', e);
			}
		}
	};

	const sendMessage = (sender: string, text: string) => {
		setMessages((prevMessages) => [...prevMessages, { sender, text }]);
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
				<div className='grow flex flex-col items-center justify-center mt-[3rem]'>
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
						className='w-[52rem] h-[47rem] mb-4 flex flex-col overflow-y-auto shadow-md p-3 bg-[#3a3a3a] rounded-lg'
					>
						{messages.map((msg, index) => (
							<Message
								key={index}
								sender={msg.sender}
								text={msg.text}
							/>
						))}
					</div>
					{interviewId ? (
						<>
							<a
								href={`/report/${interviewId}`}
								className='cursor-pointer text-[var(--color-accent)]'
							>
								View report
							</a>
						</>
					) : (
						<>
							{interviewCompleted ? (
								<div>Generating report...</div>
							) : (
								<ResponseBar
									onSubmitResponse={handleResponseSubmit}
								/>
							)}
						</>
					)}
				</div>
			)}
		</>
	);
};

export default Interview;
