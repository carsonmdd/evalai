'use client';

import { Interview } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';

const History = () => {
	const [interviews, setInterviews] = useState<Interview[]>([]);

	useEffect(() => {
		const fetchInterviews = async () => {
			try {
				const res = await axios.get('/api/getInterviews');
				setInterviews(res.data.interviews);
			} catch (e) {
				return (
					<div className='text-red-500'>
						Failed to fetch interviews
					</div>
				);
			}
		};

		fetchInterviews();
	}, []);

	const onDelete = async (id: string) => {
		try {
			await axios.delete('/api/deleteInterview', {
				data: { interviewId: id },
			});

			setInterviews((prevInterviews) =>
				prevInterviews.filter((interview) => interview.id !== id)
			);
		} catch (e) {
			console.error('Failed to delete interview', e);
		}
	};

	const formatTime = (time: Date) => {
		return new Date(time).toLocaleString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		});
	};

	return (
		<div className='mx-5'>
			<table className='min-w-[50rem]'>
				<thead>
					<tr className='bg-light-gray'>
						<th className='p-2 border'>Job Description</th>
						<th className='p-2 border'>Date and Time</th>
						<th className='p-2 border'>Score</th>
						<th className='p-2 border'>Actions</th>
					</tr>
				</thead>
				<tbody>
					{interviews.map((interview) => (
						<tr key={interview.id} className='text-center border'>
							<td className='p-2 border text-start'>
								<div className='max-h-[6rem] max-w-[30rem] overflow-y-auto'>
									{interview.jobDesc}
								</div>
							</td>
							<td className='p-2 border'>
								{formatTime(interview.startTime)}
							</td>
							<td className='p-2 border'>
								{interview.overallScore}
							</td>
							<td className='p-2 border space-x-2'>
								<div className='flex flex-col items-center justify-center gap-2'>
									<a
										href={`/report/${interview.id}`}
										className='px-3 py-1 border border-[var(--color-accent)] rounded'
									>
										View Report
									</a>
									<button
										onClick={() => onDelete(interview.id)}
										className='px-3 py-1 border border-red-500 rounded cursor-pointer'
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default History;
