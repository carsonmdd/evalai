import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
	apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(request: Request) {
	try {
		const { jobDescription } = await request.json();

		const { object } = await generateObject({
			model: google('gemini-1.5-flash'),
			schema: z.array(z.string()).length(5),
			prompt: `
				You are an employer interviewing a potential candidate.
				Generate 5 distinct behavioral interview questions based on the following job description:

				${jobDescription}
			`,
		});

		return new Response(JSON.stringify({ questions: object }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.error(e);
		return new Response('Failed to generate questions', { status: 500 });
	}
}
