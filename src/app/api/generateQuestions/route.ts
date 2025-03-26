import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
	apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(request: Request) {
	const { jobDescription } = await request.json();

	// const { object } = await generateObject({
	// 	model: google('gemini-1.5-flash'),
	// 	schema: z.array(z.string()).length(5),
	// 	prompt: `
	// 		You are an employer interviewing a potential candidate.
	// 		Generate 5 distinct behavioral interview questions based on the following job description:

	// 		${jobDescription}
	// 	`,
	// });

	const object = [
		'Tell me about a time you had to learn a new technology quickly. How did you approach it, and what was the outcome?',
		'Describe a situation where you faced a challenging technical problem on a team project. How did you contribute to finding a solution?',
		'Share an example of a time you had to work with a difficult teammate or navigate a conflict within a team. How did you handle the situation?',
		'This internship involves presenting your work to the team. Describe a time you presented your work to an audience, either technical or non-technical. What was the experience like, and what did you learn?',
		'FOR TESTING: Our work environment values collaboration and open communication. Give me an example of a time you effectively collaborated with others to achieve a shared goal. What was your role, and what was the outcome?',
	];

	return new Response(JSON.stringify({ questions: object }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
