'use client';

import React, { useEffect, useState } from 'react';
import {
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
	useAuth,
} from '@clerk/nextjs';

type Props = {};

const Navbar = (props: Props) => {
	const { isLoaded, isSignedIn } = useAuth();

	return (
		<nav className='fixed z-10 w-full flex justify-between items-center px-10 py-4 text-2xl'>
			<div>
				<a href='/' className='hover:text-[var(--color-accent)]'>
					EvalAI
				</a>
			</div>

			<div className='space-x-10 flex'>
				<a
					href='/interview'
					className='hover:text-[var(--color-accent)]'
				>
					Interview
				</a>
				<a href='/reports' className='hover:text-[var(--color-accent)]'>
					Reports
				</a>
				<a href='/history' className='hover:text-[var(--color-accent)]'>
					History
				</a>
				<SignedOut>
					<SignInButton />
				</SignedOut>
				{isLoaded ? (
					<UserButton />
				) : (
					<div className='w-[28px] h-[28px] bg-gray-400 rounded-full' />
				)}
			</div>
		</nav>
	);
};

export default Navbar;
