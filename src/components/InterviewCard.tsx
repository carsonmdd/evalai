import { Interview } from '@prisma/client';
import React from 'react';
import ClientDatetime from './ClientDateTime';
import Link from 'next/link';

type Props = {
	interview: Interview;
	onDelete: (id: string) => void;
};

const InterviewCard = ({ interview, onDelete }: Props) => {
	return (
		<div
			key={interview.id}
			className='mb-6 p-4 bg-gray-800 rounded-lg space-y-3'
		>
			<div className='max-h-[7lh] max-w-[40rem] overflow-y-auto'>
				{interview.jobDesc}
			</div>
			<div className='text-sm'>
				<strong>Date:</strong>{' '}
				<ClientDatetime time={interview.startTime} />
			</div>
			<div className='text-sm'>
				<strong>Score:</strong> {interview.overallScore}
			</div>
			<div className='flex justify-between'>
				<Link
					href={`/report/${interview.id}`}
					className='px-3 py-1 border-2 border-violet-700 rounded hover:bg-[#253038] transition-colors duration-200'
				>
					View Report
				</Link>
				<button
					onClick={() => onDelete(interview.id)}
					className='px-3 py-1 border-2 border-red-500 rounded cursor-pointer hover:bg-[#253038] transition-colors duration-200'
				>
					Delete
				</button>
			</div>
		</div>
	);
};

export default InterviewCard;
