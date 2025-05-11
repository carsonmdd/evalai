'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
	const { isLoaded } = useAuth();
	const pathname = usePathname();
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => setMenuOpen(!menuOpen);

	return (
		<nav className='fixed z-10 w-[98%] self-center flex justify-between items-center px-14 py-4 text-2xl font-bold bg-[#1a2228]/99 rounded-full'>
			<div
				className={`flex items-center justify-center gap-3 cursor-pointer hover:text-violet-400 transition-colors duration-200 ${
					pathname === '/' ? 'text-violet-500' : ''
				}`}
				onClick={toggleMenu}
			>
				<Image
					src='/ai-avatar.png'
					width={40}
					height={40}
					alt='AI avatar'
					className='rounded-full'
				/>
				<Link href='/home'>EvalAI</Link>
			</div>

			<div className='hidden md:flex space-x-10 items-center justify-center'>
				<Link
					href='/interview'
					className={`hover:text-violet-400 transition-colors duration-200 ${
						pathname === '/interview' ? 'text-violet-500' : ''
					}`}
				>
					Interview
				</Link>
				<Link
					href='/history'
					className={`hover:text-violet-400 transition-colors duration-200 ${
						pathname === '/history' ? 'text-violet-500' : ''
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

			<button className='md:hidden cursor-pointer' onClick={toggleMenu}>
				{menuOpen ? <X size={30} /> : <Menu size={30} />}
			</button>

			{menuOpen && (
				<div className='absolute top-[100%] right-3 mt-2 w-48 bg-[#1a2228] rounded-xl shadow-lg flex flex-col space-y-4 p-4 md:hidden text-[20px]'>
					<Link
						href='/interview'
						className={`hover:text-violet-400 transition-colors duration-200 ${
							pathname === '/interview' ? 'text-violet-500' : ''
						}`}
						onClick={toggleMenu}
					>
						Interview
					</Link>
					<Link
						href='/history'
						className={`hover:text-violet-400 transition-colors duration-200 ${
							pathname === '/history' ? 'text-violet-500' : ''
						}`}
						onClick={toggleMenu}
					>
						History
					</Link>
					{isLoaded ? (
						<UserButton />
					) : (
						<div className='w-[28px] h-[28px] bg-gray-400 rounded-full' />
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
