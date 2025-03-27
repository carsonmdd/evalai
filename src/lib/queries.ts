import { User } from '@prisma/client';
import prisma from './prisma';

export const insertUser = async (
	userData: Omit<User, 'createdAt' | 'updatedAt'>
) => {
	try {
		const user = await prisma.user.create({
			data: userData,
		});
		return user;
	} catch (e) {
		console.error(e);
		throw new Error('Failed to insert user');
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
		throw new Error('Failed to search for user');
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
