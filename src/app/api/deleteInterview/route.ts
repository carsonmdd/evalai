import { deleteInterview } from '@/lib/queries';

export async function DELETE(request: Request) {
	try {
		const { interviewId } = await request.json();

		await deleteInterview(interviewId);

		return new Response('Deleted successfully', { status: 200 });
	} catch (e) {
		console.error('API error:', e);
		return new Response('Failed to delete interview', { status: 500 });
	}
}
