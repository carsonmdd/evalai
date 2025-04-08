import { Interview, QuestionResponse, User } from '@prisma/client';
import { prisma } from './prisma';
import { auth } from '@clerk/nextjs/server';

export const createUser = async (
	userData: Omit<User, 'createdAt' | 'updatedAt'>
) => {
	try {
		const upsertUser = await prisma.user.upsert({
			where: { email: userData.email },
			update: userData,
			create: userData,
		});

		return upsertUser;
	} catch (e) {
		console.error('Database error:', e);
		throw new Error('Failed to create user');
	}
};

export const getUser = async () => {
	try {
		const { userId } = await auth();
		if (!userId) {
			throw new Error('User not logged in');
		}

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		return user;
	} catch (e) {
		console.error('Database error:', e);
		throw new Error('Failed to fetch user');
	}
};

export const updateUser = async (userId: string, userData: Partial<User>) => {
	try {
		const user = await prisma.user.update({
			where: {
				id: userId,
			},
			data: userData,
		});
		return user;
	} catch (e) {
		console.error('Database error:', e);
		throw new Error('Failed to update user');
	}
};

export const deleteUser = async (userId: string) => {
	try {
		const deletedUser = await prisma.user.delete({
			where: {
				id: userId,
			},
		});
		return deletedUser;
	} catch (e) {
		console.error('Database error:', e);
		throw new Error('Failed to delete user');
	}
};

export const getAllUsers = async () => {
	try {
		const users = await prisma.user.findMany();
		return users;
	} catch (e) {
		console.error('Database error:', e);
		throw new Error('Failed to fetch users');
	}
};

export const createInterview = async ({
	interviewData,
	questionResponses,
}: {
	interviewData: Omit<Interview, 'id'>;
	questionResponses: Omit<QuestionResponse, 'id' | 'interviewId'>[];
}) => {
	try {
		const interview = await prisma.interview.create({
			data: {
				...interviewData,
				questionResponses: {
					create: questionResponses,
				},
			},
		});
		return interview;
	} catch (e) {
		console.error('Database error:', e);
		throw new Error('Failed to create interview');
	}
};

export const getInterview = async (interviewId: string) => {
	try {
		const { userId } = await auth();
		if (!userId) {
			throw new Error('User not logged in');
		}

		const interview = await prisma.interview.findFirst({
			where: {
				id: interviewId,
				userId: userId,
			},
			include: {
				questionResponses: true,
			},
		});
		return interview;
	} catch (e) {
		console.error('Database error:', e);
		throw new Error('Failed to fetch interview');
	}
};

export const getUserInterviews = async () => {
	try {
		const { userId } = await auth();
		if (!userId) {
			throw new Error('User not logged in');
		}

		const interviews = await prisma.interview.findMany({
			where: {
				userId: userId,
			},
			orderBy: {
				startTime: 'desc',
			},
		});
		return interviews;
	} catch (e) {
		console.error('Database error:', e);
		throw new Error('Failed to fetch user interviews');
	}
};

export const deleteInterview = async (interviewId: string) => {
	try {
		const { userId } = await auth();
		if (!userId) {
			throw new Error('User not logged in');
		}

		await prisma.interview.delete({
			where: {
				userId,
				id: interviewId,
			},
		});
	} catch (e) {
		console.error('Database error:', e);
		throw new Error('Failed to delete interview');
	}
};
