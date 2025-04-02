import { getUserInterviews } from '@/lib/queries';

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
