import { getUser } from '@/lib/queries';

export async function GET() {
	try {
		const user = await getUser();

		return new Response(JSON.stringify({ user }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.error(e);
		return new Response('Failed to get user', { status: 500 });
	}
}
