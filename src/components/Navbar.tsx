'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

const Navbar = () => {
	const { isLoaded } = useAuth();
	const pathname = usePathname();

	return (
		<nav className='fixed z-10 w-full flex justify-between items-center px-14 py-4 text-2xl font-bold bg-[var(--color-light-gray)]'>
			<div className='flex items-center justify-center gap-3'>
				<img
					src='/ai-avatar.png'
					alt='AI avatar'
					className='w-10 h-10 rounded-full'
				/>
				<a
					href='/'
					className={`hover:text-[var(--color-light-purple)] transition-colors duration-200 ${
						pathname === '/' ? 'text-[var(--color-accent)]' : ''
					}`}
				>
					EvalAI
				</a>
			</div>

			<div className='space-x-10 flex items-center justify-center'>
				<a
					href='/interview'
					className={`hover:text-[var(--color-light-purple)] transition-colors duration-200 ${
						pathname === '/interview'
							? 'text-[var(--color-accent)]'
							: ''
					}`}
				>
					Interview
				</a>
				<a
					href='/history'
					className={`hover:text-[var(--color-light-purple)] transition-colors duration-200 ${
						pathname === '/history'
							? 'text-[var(--color-accent)]'
							: ''
					}`}
				>
					History
				</a>
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
