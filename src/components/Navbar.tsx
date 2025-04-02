'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
	const { isLoaded } = useAuth();
	const pathname = usePathname();

	return (
		<nav className='fixed z-10 w-full flex justify-between items-center px-14 py-4 text-2xl font-bold bg-[var(--color-light-gray)]'>
			<div className='flex items-center justify-center gap-3'>
				<Image
					src='/ai-avatar.png'
					width={40}
					height={40}
					alt='AI avatar'
					className='rounded-full'
				/>
				<Link
					href='/'
					className={`hover:text-[var(--color-light-purple)] transition-colors duration-200 ${
						pathname === '/' ? 'text-[var(--color-accent)]' : ''
					}`}
				>
					EvalAI
				</Link>
			</div>

			<div className='space-x-10 flex items-center justify-center'>
				<Link
					href='/interview'
					className={`hover:text-[var(--color-light-purple)] transition-colors duration-200 ${
						pathname === '/interview'
							? 'text-[var(--color-accent)]'
							: ''
					}`}
				>
					Interview
				</Link>
				<Link
					href='/history'
					className={`hover:text-[var(--color-light-purple)] transition-colors duration-200 ${
						pathname === '/history'
							? 'text-[var(--color-accent)]'
							: ''
					}`}
				>
					History
				</Link>
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
