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
			temperature: 0.2,
			schema: z.array(z.string()).length(5),
			prompt: `
				You are a hiring expert interviewing a potential candidate.
				Given a job description, generate 5 thoughtful, relevant, and distinct behavioral interview questions that assess the candidate's fit for the role.
				Each question should be unique and focus on different aspects of the candidate's experience and skills.
				
				Examples of good questions based on a simple job description:
				Job: "Software Engineer - Frontend"
				Questions: [
					"Can you describe a time when you had to debug a complex issue in a web application? What steps did you take to identify and resolve the problem?",
					"How do you prioritize your tasks when working on multiple projects with tight deadlines?",
					"Can you give an example of a time when you had to collaborate with a designer to implement a new feature? How did you ensure the design was implemented correctly?",
					"Describe a situation where you had to learn a new technology quickly to complete a project. How did you approach the learning process?",
					"Can you share an experience where you had to optimize the performance of a web application? What techniques did you use to improve its speed and responsiveness?"
				]
				Job: "Data Scientist - Machine learning"
				Questions: [
					"Can you describe a time when you had to build a machine learning model from scratch? What steps did you take to ensure its accuracy and reliability?",
					"How do you approach feature engineering when working with complex datasets? Can you provide an example of a successful feature engineering project?",
					"Can you give an example of a time when you had to communicate complex data findings to a non-technical audience? How did you ensure they understood the key insights?",
					"Describe a situation where you had to work with a team to deploy a machine learning model into production. What challenges did you face and how did you overcome them?",
					"Can you share an experience where you had to tune hyperparameters for a machine learning model? What techniques did you use to optimize its performance?"
				]
				
				Now, given this job description:
				${jobDescription}
				Generate 5 unique, relevant, and thoughtful behavioral interview questions that assess the candidate's fit for the role.
				Don't include double quotes around each question.
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
