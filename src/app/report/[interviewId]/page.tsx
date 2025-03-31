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
				<div className='grow flex flex-col items-center justify-center'>
					<div>
						<h1 className='text-2xl font-bold mb-4'>
							{`Interview Report for ${formattedTime}`}
						</h1>
						<p>{`Overall Score: ${interview.overallScore}/10`}</p>
						<p>{`Job Description: ${interview.jobDesc}`}</p>
					</div>
					<hr className='my-4 w-[700px]' />
					{interview.questionResponses.map((qr, index) => (
						<QrCard key={index} />
					))}
				</div>
			)}
		</>
	);
};

export default Reports;
