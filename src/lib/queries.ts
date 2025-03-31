import { Interview, QuestionResponse, User } from '@prisma/client';
import prisma from './prisma';

export const createUser = async (
	userData: Omit<User, 'createdAt' | 'updatedAt'>
) => {
	try {
		const user = await prisma.user.create({
			data: userData,
		});
		return user;
	} catch (e) {
		console.error(e);
		throw new Error('Failed to create user');
	}
};

export const getUser = async (userId: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		return user;
	} catch (e) {
		console.error(e);
		throw new Error('Failed to fetch user');
	}
};

export const getAllUsers = async () => {
	try {
		const users = await prisma.user.findMany();
		return users;
	} catch (e) {
		console.error(e);
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
		const report = await prisma.interview.create({
			data: {
				...interviewData,
				questionResponses: {
					create: questionResponses,
				},
			},
		});
		return report;
	} catch (e) {
		console.error(e);
		throw new Error('Failed to create report');
	}
};
