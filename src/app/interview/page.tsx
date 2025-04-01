'use client';

import Message from '@/components/Message';
import ResponseBar from '@/components/ResponseBar';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

type Props = {};

const Interview = (props: Props) => {
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
		// Testing job description
		setJobDescription(`
Job Summary
As a Software Engineer Intern, you would participate in product design, development, verification, troubleshooting, and delivery of a system or major subsystems. This position requires an individual to be creative, team-oriented, technology savvy, driven to produce results and demonstrates the ability to take a cross-team leadership role.   

We invest heavily in new talent. Your energy and fresh ideas are vital to cementing our position as a market -leader. We’ll push you beyond your comfort zone with a belief that no idea is off-limits. At the same time, you’ll have all the resources, mentoring and feedback you need to grow. What’s more, whatever your role, you can be yourself in a team that celebrates individuality and welcomes different perspectives.  

Job Requirements
Experience with multiple programming languages is a benefit but there is also room to improve your skills.  Our intern work differs depending on the team and project work but some potential areas of focus and skill sets are-  

Front End Development:     

Design and implement code using Functional and Object-Oriented JavaScript, HTMP, CSS   

Develop enterprise SaaS software using modular, reusable JS components and data visualizations   

Understanding of concepts related to computer architecture, data structures and algorithms and design patterns/practices   

Back End Development:   

Understanding of Java, Python, C, and/or C++   

Participate in product design, development, verification, troubleshooting, and delivery of a system or major subsystems   

Projects, experiences, or coursework related to areas such as: Operating Systems, Computer Architecture, Multi-Threading, Data Structures & Algorithms   

Other helpful skillsets:  

Proven aptitude for learning new technologies   

Creative and analytical approach problem solving skills   

Strong oral and written communication is necessary for success   

Ability to work on a diverse team or with a diverse range of people  

Additional Details: 

Job Posting Info: This is a pipeline position that will be opened on a recurring basis and used to fill roles aligned with the required skill sets. 

Program Dates: This is an internship with start dates in May or June 2025.  Recruiting efforts will be ongoing until specific teams find an ideal match. 

Thrive Together: NetApp’s approach to in-person and remote work will be a flexible hybrid model that emphasizes flexibility for employees and puts our talent first. 

Education & Experience
Must be enrolled in an educational or professional program through summer 2025 or later.  

Compensation:
Final compensation packages are competitive and in line with industry standards, reflecting a variety of factors, and include a comprehensive benefits package. This may cover Health Insurance, Life Insurance, Retirement or Pension Plans, Paid Time Off (PTO), various Leave options, Performance-Based Incentives, employee stock purchase plan, and/or restricted stocks (RSU’s), with all offerings subject to regional variations and governed by local laws, regulations, and company policies. Benefits may vary by country and region, and further details will be provided as part of the recruitment process. 

At NetApp, we embrace a hybrid working environment designed to strengthen connection, collaboration, and culture for all employees. This means that most roles will have some level of in-office and/or in-person expectations, which will be shared during the recruitment process.

Equal Opportunity Employer:

NetApp is firmly committed to Equal Employment Opportunity (EEO) and to compliance with all federal, state and local laws that prohibit employment discrimination based on age, race, color, gender, sexual orientation, gender identity, national origin, religion, disability or genetic information, pregnancy, protected veteran status, and any other protected classification.

Did you know...

Statistics show women apply to jobs only when they're 100% qualified. But no one is 100% qualified. We encourage you to shift the trend and apply anyway! We look forward to hearing from you.

Why NetApp?

We are all about helping customers turn challenges into business opportunity. It starts with bringing new thinking to age-old problems, like how to use data most effectively to run better - but also to innovate. We tailor our approach to the customer's unique needs with a combination of fresh thinking and proven approaches.

We enable a healthy work-life balance. Our volunteer time off program is best in class, offering employees 40 hours of paid time per year to volunteer with their favorite organizations. We provide comprehensive medical, dental, wellness, and vision plans for you and your family. We offer educational assistance, legal services, and access to discounts. Finally, we provide financial savings programs to help you plan for your future.

If you want to help us build knowledge and solve big problems, let's talk.

Submitting an application

To ensure a streamlined and fair hiring process for all candidates, our team only reviews applications submitted through our company website. This practice allows us to track, assess, and respond to applicants efficiently. Emailing our employees, recruiters, or Human Resources personnel directly will not influence your application.
		`);
		const response = await axios.post('/api/generateQuestions', {
			jobDescription,
		});

		setQuestions(response.data.questions);
		sendMessage('ai', response.data.questions[0]);
		setInterviewStarted(true);
		setStartTime(new Date());
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

			const response = await axios.post('/api/generateReport', {
				startTime,
				jobDesc: jobDescription,
				questionResponses: updatedResponses,
			});
			setInterviewId(response.data.interview.id);
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
