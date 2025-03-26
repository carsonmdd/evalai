'use client';

import axios from 'axios';
import React, { useState } from 'react';

type Props = {};

const Interview = (props: Props) => {
	const [interviewStarted, setInterviewStarted] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [jobDescription, setJobDescription] = useState('');

	const handleStartInterview = async () => {
		// display 5 questions to ask
		const response = await axios.post('/api/generateQuestions', {
			jobDescription,
		});

		setQuestions(response.data.questions);
		setInterviewStarted(true);
	};

	return (
		<>
			{!interviewStarted ? (
				<div className='grow flex flex-col items-center justify-center'>
					<h1 className='font-bold text-3xl mb-6'>Job Description</h1>
					<textarea
						className='mb-12 border border-white rounded-xl w-[45rem] h-[30rem] p-5 text-xl'
						placeholder='Paste a job description here'
						onChange={(e) => setJobDescription(e.target.value)}
					></textarea>
					<button
						onClick={handleStartInterview}
						className='cursor-pointer bg-[var(--color-accent)] hover:bg-[#7d4fbd] rounded text-2xl px-4 py-1'
					>
						Begin Interview
					</button>
				</div>
			) : (
				<div className='grow flex flex-col items-center justify-center text-2xl p-20 gap-10'>
					{questions.map((question, index) => (
						<div key={index} className='mb-5'>
							<p>{question}</p>
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default Interview;
