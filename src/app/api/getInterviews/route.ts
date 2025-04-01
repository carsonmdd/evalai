import { getUserInterviews } from '@/lib/queries';

export async function GET() {
	const interviews = await getUserInterviews();

	return new Response(JSON.stringify({ interviews }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
