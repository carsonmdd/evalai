'use client';

import React, { useEffect, useState } from 'react';
import {
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
	useAuth,
} from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

type Props = {};

const Navbar = (props: Props) => {
	const { isLoaded, isSignedIn } = useAuth();
	const pathname = usePathname();

	return (
		<nav className='fixed z-10 w-full flex justify-between items-center px-14 py-4 text-2xl font-bold bg-[var(--color-light-gray)]'>
			<div>
				<a href='/'>EvalAI</a>
			</div>

			<div className='space-x-10 flex'>
				<a
					href='/interview'
					className={`${
						pathname === '/interview'
							? 'text-[var(--color-accent)]'
							: ''
					}`}
				>
					Interview
				</a>
				<a
					href='/history'
					className={`${
						pathname === '/history'
							? 'text-[var(--color-accent)]'
							: ''
					}`}
				>
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
