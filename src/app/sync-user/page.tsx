import { getUser, createUser } from '@/lib/queries';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';

const SyncUser = async () => {
	const { userId } = await auth();
	if (!userId) {
		throw new Error('User not found');
	}
	const client = await clerkClient();
	const user = await client.users.getUser(userId);
	if (!user.emailAddresses[0]?.emailAddress) {
		return notFound();
	}

	// Check if user already exists in the database
	const existingUser = await getUser(userId);
	if (existingUser) {
		return redirect('/interview');
	}

	await createUser({
		id: userId,
		imageUrl: user.imageUrl,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.emailAddresses[0]?.emailAddress ?? '',
	});

	return redirect('/interview');
};

export default SyncUser;
