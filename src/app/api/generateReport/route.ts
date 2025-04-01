import { createInterview } from '@/lib/queries';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { auth } from '@clerk/nextjs/server';
import { generateObject } from 'ai';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
	apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
});

type QuestionResponse = {
	question: string;
	response: string;
};

export async function POST(request: Request) {
	// const { startTime, jobDesc, questionResponses } = await request.json();

	// For testing:
	const startTime = new Date();
	const jobDesc = `
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
	`;
	const questionResponses: QuestionResponse[] = [
		{
			question:
				'Tell me about a time you had to learn a new technology quickly. How did you approach it, and what was the outcome?',
			response:
				'I had to learn React for a hackathon project in a weekend. I followed a crash course, built small components, and referenced documentation frequently. By the end, I successfully built a functional web app with my team.',
		},
		{
			question:
				'Describe a situation where you faced a challenging technical problem on a team project. How did you contribute to finding a solution?',
			response:
				'While working on a database migration, we encountered unexpected data inconsistencies. I wrote scripts to clean and transform the data, and after testing, we successfully completed the migration with minimal downtime.',
		},
		{
			question:
				'Share an example of a time you had to work with a difficult teammate or navigate a conflict within a team. How did you handle the situation?',
			response:
				'A teammate was resistant to feedback on a project direction. I scheduled a one-on-one discussion, actively listened to their concerns, and proposed a compromise that incorporated their ideas while aligning with project goals.',
		},
		{
			question:
				'This internship involves presenting your work to the team. Describe a time you presented your work to an audience, either technical or non-technical. What was the experience like, and what did you learn?',
			response:
				'I presented a machine learning project at a university research fair. I simplified technical concepts for non-experts and answered questions confidently. The experience improved my ability to communicate complex ideas clearly.',
		},
		{
			question:
				'Our work environment values collaboration and open communication. Give me an example of a time you effectively collaborated with others to achieve a shared goal. What was your role, and what was the outcome?',
			response:
				'In a group project, we had to develop a mobile app under a tight deadline. I coordinated tasks, ensured clear communication, and helped troubleshoot issues. Our app was completed on time and received positive feedback.',
		},
	];

	const formattedQuestions = questionResponses
		.map(
			(qr: QuestionResponse, index: number) =>
				`Q${index + 1}: ${qr.question}\nA${index + 1}: ${qr.response}`
		)
		.join('\n\n');

	const { object } = await generateObject({
		model: google('gemini-1.5-flash'),
		schema: z.array(
			z.object({
				questionNumber: z.number().int().min(1),
				score: z.number().int().min(1).max(10),
				strengths: z.string(),
				areasForImprovement: z.string(),
			})
		),
		prompt: `
			You are an interviewer evaluating a candidate's responses to interview questions.
			For each question-answer pair provided, generate the following:
			- The question number (e.g., 1 for Q1, 2 for Q2, etc.)
			- Overall score (1-10) based on the quality of the response.
			- Strengths comment highlighting the positive aspects of the response.
			- Areas for improvement comment suggesting how the response could be enhanced.

			Here are the question-answer pairs:

			${formattedQuestions}

			Return the results in the following JSON format where :
			[
				{
					"questionNumber": <number>,
					"score": <number between 1 and 10>,
					"strengths": "...",
					"areasForImprovement": "..."
				}
			]
		`,
	});

	const overallScore = parseFloat(
		(
			object.reduce((acc, curr) => acc + curr.score, 0) / object.length
		).toFixed(2)
	);

	const reportQrs = questionResponses.map(
		(qr: QuestionResponse, index: number) => {
			const match = object.find((o) => o.questionNumber === index + 1);
			if (!match) {
				return {
					question: qr.question,
					response: qr.response,
					score: 0,
					strengths: 'No evaluation provided.',
					improv: 'No evaluation provided.',
				};
			}

			return {
				...qr,
				score: match.score,
				strengths: match.strengths,
				improv: match.areasForImprovement,
			};
		}
	);

	const { userId } = await auth();
	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const interview = await createInterview({
		interviewData: {
			startTime,
			jobDesc,
			overallScore,
			userId,
		},
		questionResponses: reportQrs,
	});

	return new Response(JSON.stringify({ interview }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
