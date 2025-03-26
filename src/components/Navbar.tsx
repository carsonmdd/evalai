'use client';

import React from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

type Props = {};

const Navbar = (props: Props) => {
	return (
		<nav className='flex justify-between items-center px-10 py-2 text-2xl'>
			<div>
				<a href='/' className='hover:text-[var(--color-accent)]'>
					EvalAI
				</a>
			</div>

			<div className='space-x-5 flex'>
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
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</nav>
	);
};

export default Navbar;
