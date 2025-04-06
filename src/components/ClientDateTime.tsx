'use client';

import { formatTime } from '@/utils/date';

export default function ClientDatetime({ time }: { time: Date }) {
	return formatTime(time);
}
