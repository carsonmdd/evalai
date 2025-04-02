import { SignInButton } from '@clerk/nextjs';
import React from 'react';

const CustomSignInButton = () => {
	return (
		<SignInButton>
			<div className='cursor-pointer border-2 border-[var(--color-accent)] p-1 rounded-xl'>
				Sign In
			</div>
		</SignInButton>
	);
};

export default CustomSignInButton;
