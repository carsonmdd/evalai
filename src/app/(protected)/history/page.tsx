'use client';

import { Interview } from '@prisma/client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const History = () => {
	const [loading, setLoading] = useState(true);
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
				console.error(e);
				setError('Failed to fetch interviews');
			} finally {
				setLoading(false);
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

	if (loading) {
		return (
			<div className='flex grow items-center justify-center text-2xl'>
				Loading...
			</div>
		);
	} else if (error) {
		return (
			<div className='flex grow items-center justify-center text-red-500 text-2xl'>
				{error}
			</div>
		);
	} else {
		return (
			<div className='flex grow items-center justify-center p-[4rem]'>
				{interviews.length > 0 ? (
					<table className='min-w-[50rem] self-start'>
						<thead>
							<tr className='bg-gray-700'>
								<th className='p-2 border'>Job Description</th>
								<th className='p-2 border'>Date and Time</th>
								<th className='p-2 border'>Score</th>
								<th className='p-2 border'>Actions</th>
							</tr>
						</thead>
						<tbody>
							{interviews.map((interview) => (
								<tr
									key={interview.id}
									className='text-center border'
								>
									<td className='p-3 border text-start'>
										<div className='max-h-[7lh] max-w-[40rem] overflow-y-auto'>
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
											<Link
												href={`/report/${interview.id}`}
												className='px-3 py-1 border-2 border-violet-700 rounded hover:bg-[#253038] transition-colors duration-200'
											>
												View Report
											</Link>
											<button
												onClick={() =>
													onDelete(interview.id)
												}
												className='px-3 py-1 border-2 border-red-500 rounded cursor-pointer hover:bg-[#253038] transition-colors duration-200'
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div className='text-2xl'>No interviews found</div>
				)}
			</div>
		);
	}
};

export default History;
