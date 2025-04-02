'use client';

import { useUser } from '@clerk/nextjs';
import { Interview } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';

const History = () => {
	const [loading, setLoading] = useState(false);
	const [interviews, setInterviews] = useState<Interview[]>([]);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchInterviews = async () => {
			try {
				setLoading(true);
				const res = await axios.get('/api/getInterviews');
				setInterviews(res.data.interviews);
				setError('');
			} catch (e) {
				setError('Failed to fetch interviews');
			} finally {
				setLoading(false);
			}
		};

		fetchInterviews();
	}, []);

	const onDelete = async (id: string) => {
		try {
			setLoading(true);
			await axios.delete('/api/deleteInterview', {
				data: { interviewId: id },
			});

			setInterviews((prevInterviews) =>
				prevInterviews.filter((interview) => interview.id !== id)
			);
		} catch (e) {
			console.error('Failed to delete interview', e);
		} finally {
			setLoading(false);
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

	if (loading) {
		return (
			<div className='flex items-center justify-center text-xl'>
				Loading...
			</div>
		);
	} else if (error) {
		return (
			<div className='flex items-center justify-center text-red-500'>
				{error}
			</div>
		);
	}

	return (
		<div className='mx-5 flex items-center justify-center'>
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
								<div className='max-h-[10rem] max-w-[40rem] overflow-y-auto'>
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
