'use client';

import Message from '@/components/Message';
import ResponseBar from '@/components/ResponseBar';
import { handleKeyDown } from '@/utils/keyboard';
import axios from 'axios';
import Link from 'next/link';
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
	const [generatingQuestions, setGeneratingQuestions] = useState(false);

	const [messages, setMessages] = useState<
		{ sender: string; text: string }[]
	>([]);
	const [jobDescription, setJobDescription] = useState('');
	const [interviewId, setInterviewId] = useState('');
	const [userImage, setUserImage] = useState('');

	const chatContainerRef = useRef<HTMLDivElement | null>(null);

	const handleStartInterview = async () => {
		try {
			setGeneratingQuestions(true);
			const response = await axios.post('/api/generate-questions', {
				jobDescription,
			});

			setQuestions(response.data.questions);
			sendMessage('ai', response.data.questions[0]);
			setInterviewStarted(true);
			setStartTime(new Date());
			setGeneratingQuestions(false);
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
				const response = await axios.post('/api/interviews', {
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

	useEffect(() => {
		const getUserImage = async () => {
			try {
				const res = await axios.get('/api/user');
				setUserImage(res.data.user.imageUrl);
			} catch (e) {
				console.error(e);
			}
		};

		getUserImage();
	}, []);

	return (
		<>
			{!interviewStarted ? (
				<div className='grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-8'>
					<h1 className='font-bold text-3xl mt-14 mb-6'>
						Job Description
					</h1>
					<textarea
						className='bg-[#1d262d] mb-12 border border-white rounded-xl w-full max-w-[45rem] h-[30rem] p-4 sm:p-5 text-base sm:text-xl focus:outline-none'
						placeholder='Paste a job description here'
						onChange={(e) => setJobDescription(e.target.value)}
						onKeyDown={(e) =>
							handleKeyDown(e, handleStartInterview)
						}
					></textarea>
					<button
						onClick={handleStartInterview}
						disabled={generatingQuestions}
						className={`bg-violet-700 transition-colors duration-200 rounded text-2xl px-4 py-1 ${
							!generatingQuestions
								? 'cursor-pointer hover:bg-violet-600'
								: 'opacity-75'
						}`}
					>
						{!generatingQuestions
							? 'Begin Interview'
							: 'Generating questions...'}
					</button>
				</div>
			) : (
				<div className='grow flex flex-col items-center justify-end pb-3 relative px-4 sm:px-6 md:px-8'>
					{/* Chat container */}
					<div
						ref={chatContainerRef}
						className='w-full max-w-[70rem] h-[75vh] mb-4 flex flex-col overflow-y-auto shadow-md px-3 py-5 bg-[#1d262d] rounded-lg'
					>
						{messages.map((msg, index) => (
							<Message
								key={index}
								sender={msg.sender}
								text={msg.text}
								image={
									msg.sender === 'ai'
										? '/ai-avatar.png'
										: userImage
								}
							/>
						))}
					</div>

					{/* Button/bar container */}
					<div className='h-[60px] flex items-center justify-center'>
						{interviewId ? (
							<Link
								href={`/report/${interviewId}`}
								className='cursor-pointer text-violet-500 text-xl hover:text-violet-400 transition-colors duration-200'
							>
								View report
							</Link>
						) : interviewCompleted ? (
							<div className='text-xl'>Generating report...</div>
						) : (
							<ResponseBar
								onSubmitResponse={handleResponseSubmit}
							/>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default Interview;
