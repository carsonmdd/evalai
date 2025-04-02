import React from 'react';

type Props = {
	question: string;
	response: string;
	score: number;
	strengths: string;
	improv: string;
	classes?: string;
};

const QrCard = ({
	question,
	response,
	score,
	strengths,
	improv,
	classes,
}: Props) => {
	return (
		<div
			className={`hover:scale-101 transition-transform duration-200 border-2 border-[var(--color-light-purple)] rounded-xl p-6 w-[50rem] flex flex-col text-lg ${classes}`}
		>
			<div className='space-y-2'>
				<p>
					<span className='text-[var(--color-accent)] font-bold'>
						Question{' '}
					</span>
					{question}
				</p>
				<div>
					<span className='text-[var(--color-accent)] font-bold'>
						Response:{' '}
					</span>
					<div className='max-h-[20rem] overflow-y-auto'>
						{response}
					</div>
				</div>
			</div>
			<hr className='my-6 w-11/12 self-center' />
			<div className='space-y-2'>
				<p>
					<span className='text-[var(--color-accent)] font-bold'>
						Score:{' '}
					</span>
					{`${score}/10`}
				</p>
				<p>
					<span className='text-[var(--color-accent)] font-bold'>
						Strengths:{' '}
					</span>
					{strengths}
				</p>
				<p>
					<span className='text-[var(--color-accent)] font-bold'>
						Areas for improvement:{' '}
					</span>
					{improv}
				</p>
			</div>
		</div>
	);
};

export default QrCard;
