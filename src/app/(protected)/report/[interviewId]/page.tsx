import ClientDatetime from '@/components/ClientDateTime';
import QrCard from '@/components/QrCard';
import { getInterview } from '@/lib/queries';
import React from 'react';

type Props = {
	params: Promise<{ interviewId: string }>;
};

const Reports = async (props: Props) => {
	try {
		const { interviewId } = await props.params;
		const interview = await getInterview(interviewId);

		if (!interview) {
			return (
				<div className='flex grow flex-col items-center justify-center'>
					<p className='text-red-500'>Failed to load interview</p>
				</div>
			);
		}

		return (
			<div className='flex grow flex-col items-center justify-center text-xl p-[1rem] sm:p-[2rem] md:p-[4rem]'>
				<div>
					<h1 className='text-2xl font-bold mb-8 justify-self-center mt-[7rem]'>
						Interview Report for{' '}
						<ClientDatetime time={interview.startTime} />
					</h1>
					<p>
						<span className='text-violet-500 font-bold'>
							Overall Score:{' '}
						</span>
						{`${interview.overallScore}/10`}
					</p>
					<div>
						<span className='text-violet-500 font-bold'>
							Job Description:{' '}
						</span>
						<div className='max-w-[50rem] max-h-[10lh] overflow-y-auto'>
							{interview.jobDesc}
						</div>
					</div>
				</div>
				<hr className='my-8 w-[90%] max-w-[700px]' />
				{interview.questionResponses.map((qr, index) => (
					<QrCard
						key={index}
						question={qr.question}
						response={qr.response}
						score={qr.score}
						strengths={qr.strengths}
						improv={qr.improv}
						classes='mb-6'
					/>
				))}
			</div>
		);
	} catch (e) {
		console.error('Error fetching interview:', e);
		<div className='flex grow flex-col items-center justify-center'>
			<p className='text-red-500'>Failed to load interview</p>
		</div>;
	}
};

export default Reports;
