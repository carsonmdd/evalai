import QrCard from '@/components/QrCard';
import { getInterview } from '@/lib/queries';
import React from 'react';

type Props = {
	params: Promise<{ interviewId: string }>;
};

const Reports = async (props: Props) => {
	const { interviewId } = await props.params;
	const interview = await getInterview(interviewId);
	const formattedTime = interview?.startTime.toLocaleString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});

	return (
		<>
			{!interview ? (
				<div className='grow flex flex-col items-center justify-center'>
					<p>Interview not found</p>
				</div>
			) : (
				<div className='grow flex flex-col items-center justify-center text-xl'>
					<div>
						<h1 className='text-2xl font-bold mb-4'>
							{`Interview Report for ${formattedTime}`}
						</h1>
						<p>
							<span className='text-[var(--color-accent)] font-bold'>
								Overall Score:{' '}
							</span>
							{`${interview.overallScore}/10`}
						</p>
						<p>
							<span className='text-[var(--color-accent)] font-bold'>
								Job Description:{' '}
							</span>
							{interview.jobDesc}
						</p>
					</div>
					<hr className='my-8 w-[700px]' />
					{interview.questionResponses.map((qr, index) => (
						<QrCard
							key={index}
							question={qr.question}
							response={qr.response}
							score={qr.score}
							strengths={qr.strengths}
							improv={qr.improv}
							classes='mb-4'
						/>
					))}
				</div>
			)}
		</>
	);
};

export default Reports;
