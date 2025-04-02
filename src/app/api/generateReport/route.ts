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
	try {
		const { startTime, jobDesc, questionResponses } = await request.json();

		const formattedQuestions = questionResponses
			.map(
				(qr: QuestionResponse, index: number) =>
					`Q${index + 1}: ${qr.question}\nA${index + 1}: ${
						qr.response
					}`
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
			You are an experienced interviewer providing feedback to a candidate based on their responses to interview questions.
			For each question-answer pair provided, generate the following:
			- The question number (e.g., 1 for Q1, 2 for Q2, etc.)
			- Overall score (1-10) based on the quality of their response. Feel free to give very low or very high scores for extremely poor or exceptional responses respectively.
			- Strengths comment highlighting the positive aspects of their response. If the response lacks any strengths, you may write "None".
			- Areas for improvement comment suggesting how their response could be enhanced.

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
				object.reduce((acc, curr) => acc + curr.score, 0) /
				object.length
			).toFixed(2)
		);

		const reportQrs = questionResponses.map(
			(qr: QuestionResponse, index: number) => {
				const match = object.find(
					(o) => o.questionNumber === index + 1
				);
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
	} catch (error) {
		return new Response('Failed to generate report', { status: 500 });
	}
}
