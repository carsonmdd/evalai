import { createInterview } from '@/lib/queries';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
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
	const jobDesc = 'Software engineer intern';
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

	const interview = await createInterview({
		interviewData: {
			startTime,
			jobDesc,
			overallScore,
		},
		questionResponses: reportQrs,
	});

	return new Response(JSON.stringify({ interview }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
