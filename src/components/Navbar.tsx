'use client';

import { SignedOut, UserButton, useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import CustomSignInButton from './CustomSignInButton';

const Navbar = () => {
	const { isLoaded } = useAuth();
	const pathname = usePathname();

	return (
		<nav className='fixed z-10 w-full flex justify-between items-center px-14 py-4 text-2xl font-bold bg-[var(--color-light-gray)]'>
			<div>
				<a href='/'>EvalAI</a>
			</div>

			<div className='space-x-10 flex items-center justify-center'>
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
					<CustomSignInButton />
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
