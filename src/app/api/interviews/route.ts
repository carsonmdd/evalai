import { getUserInterviews } from '@/lib/queries';

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

export async function GET() {
	try {
		const interviews = await getUserInterviews();

		return new Response(JSON.stringify({ interviews }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.error(e);
		return new Response('Failed to get interviews', { status: 500 });
	}
}

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
			You are an experienced interviewer providing honest and insightful feedback to a candidate based on their responses to interview questions.
			For each question-answer pair provided, generate the following:
			- The question number (e.g., 1 for Q1, 2 for Q2, etc.).
			- Overall score (1-10) based on the relevance, depth of knowledge, and communication clarity of the response. You may give very low or very high scores for extremely poor or exceptional responses respectively.
			- Strengths comment highlighting the positive aspects of their response. If the response lacks any strengths, you may write "None".
			- Areas for improvement comment suggesting how their response could be enhanced.

			Examples of good feedback:
			1. Question: "Can you describe a time when you had to debug a complex issue in a web application? What steps did you take to identify and resolve the problem?"
			Response: "I once had to debug a complex issue in a web application where the page was loading slowly. I used Chrome DevTools to identify the bottleneck and found that a third-party script was causing the delay. I reached out to the vendor, and they provided a fix that improved the performance significantly."
			Feedback: {
				"questionNumber": 1,
				"score": 6,	
				"strengths": "The candidate shows practical knowledge by using Chrome DevTools effectively to isolate performance issues and demonstrates good communication skills by coordinating with a third-party vendor.",
				"areasForImprovement": "The response could be stronger by including more detail on the debugging steps taken, alternative troubleshooting considered, or any interim solutions implemented before reaching out to the vendor."
			}
			2. Question: "How do you prioritize your tasks when working on multiple projects with tight deadlines?"
			Response: "I use a priority matrix to categorize tasks based on urgency and importance. I focus on high-impact tasks first and delegate where possible. I also communicate with my team to ensure alignment on priorities."
			Feedback: {
				"questionNumber": 2,
				"score": 8,
				"strengths": "The candidate shows a structured and strategic approach to prioritization, demonstrating both personal initiative and strong team communication.",
				"areasForImprovement": "The response could be even stronger by providing more detail and a brief real-world example of when this method helped successfully manage competing deadlines."
			}
			3. Question: "Tell me about a time when you had to quickly learn a new technology to complete a project."
			Response: "I had to learn a new tool once. It worked out fine."
			Feedback: {
				"questionNumber": 3,
				"score": 2,
				"strengths": "The response briefly acknowledges adaptability by mentioning learning a new tool.",
				"areasForImprovement": "The response lacks detail, specific examples, and depth; elaborating on what the tool was, how it was learned, and the impact on the project would make the answer much stronger."
			}
			4. Question: "Describe a situation where you had to work with a difficult team member. How did you handle it?"
			Response: "d"
			Feedback: {
				questionNumber: 4,
				score: 1,
				strengths: "None",
				areasForImprovement: "The response is too brief and lacks any meaningful content. It should include a specific example of a difficult team member, the actions taken to address the situation, and the outcome."
			}

			Now, given the following question-answer pairs, provide feedback for each question:
			${formattedQuestions}

			Return the results in the following JSON format:
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
			return new Response('User not found', { status: 401 });
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
	} catch (e) {
		console.error(e);
		return new Response('Failed to generate report', { status: 500 });
	}
}
