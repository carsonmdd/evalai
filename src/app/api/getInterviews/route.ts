import { getUserInterviews } from '@/lib/queries';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
	const { userId } = await auth();
	if (!userId) {
		throw new Error('User not logged in');
	}

	const interviews = await getUserInterviews();

	return new Response(JSON.stringify({ interviews }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
