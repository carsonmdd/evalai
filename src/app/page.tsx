import Link from 'next/link';

const Home = () => {
	return (
		<div className='bg-[var(--color-background)] text-[var(--color-foreground)] grow flex flex-col items-center justify-center p-6'>
			<div className='text-center mb-[5rem]'>
				<h1 className='text-5xl font-bold mb-4 bg-gradient-to-r from-pink-700 to-violet-700 inline-block text-transparent bg-clip-text'>
					Welcome to EvalAI
				</h1>
				<p className='text-2xl max-w-2xl mx-auto'>
					Get ready for success with AI-crafted questions and detailed
					feedback to guide your interview preparation.
				</p>
			</div>
			<div className='bg-[#212b32] text-[var(--color-foreground)] border-2 border-violet-800 p-8 rounded-xl shadow-lg max-w-[29rem] text-center'>
				<h2 className='text-3xl font-semibold mb-2'>Get Started</h2>
				<p className='mb-10 text-xl'>
					{
						"Begin your interview preparation by providing a job description and we'll generate tailored questions for you."
					}
				</p>
				<Link
					className='cursor-pointer bg-gradient-to-r from-pink-700 to-violet-700 hover:scale-105 inline-block duration-200 transition-transform text-[var(--color-foreground)] py-2 px-6 rounded-full text-xl'
					href='/interview'
				>
					Start Interview
				</Link>
			</div>
		</div>
	);
};

export default Home;
