import Navbar from '@/components/Navbar';
import React from 'react';

type Props = {
	children: React.ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
	return (
		<main className='antialiased h-screen flex flex-col'>
			<Navbar />
			<div className='flex flex-grow'>{children}</div>
		</main>
	);
};

export default ProtectedLayout;
