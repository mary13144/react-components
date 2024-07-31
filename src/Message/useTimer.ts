import { useEffect, useRef } from 'react';

export interface useTimerProps {
	id: number;
	duration?: number;
	remove: (id: number) => void;
}

export default function useTimer(props: useTimerProps) {
	const { id, duration = 2000, remove } = props;

	const timer = useRef<number | null>(null);

	const startTimer = () => {
		timer.current = setTimeout(() => {
			remove(id);
			removeTimer();
		}, duration);
	};

	const removeTimer = () => {
		if (timer.current) {
			clearTimeout(timer.current);
			timer.current = null;
		}
	};

	useEffect(() => {
		startTimer();
		return () => removeTimer();
	}, []);

	const onMouseEnter = () => {
		removeTimer();
	};

	const onMouseLeave = () => {
		startTimer();
	};

	return {
		onMouseEnter,
		onMouseLeave,
	};
}
