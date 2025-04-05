import { deleteInterview } from '@/lib/queries';

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		await deleteInterview(id);

		return new Response('Deleted successfully', { status: 200 });
	} catch (e) {
		console.error('API error:', e);
		return new Response('Failed to delete interview', { status: 500 });
	}
}
