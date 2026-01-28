import { useEffect, useRef } from 'react';
import { Instance } from '../types';

export const useInstancePolling = (
	isLoggedIn: boolean,
	isEnabled: boolean,
	instances: Instance[],
	refreshSingle: (id: string) => Promise<any>,
	fetchAll: () => Promise<void>
) => {
	const fetchAllRef = useRef(fetchAll);
	const refreshSingleRef = useRef(refreshSingle);
	fetchAllRef.current = fetchAll;
	refreshSingleRef.current = refreshSingle;

	const statusFingerprint = instances.map(i => i.id + i.status).join(',');

	useEffect(() => {
		if (!isLoggedIn || !isEnabled) return;

		const slowTimer = setInterval(() => {
			fetchAllRef.current();
		}, 60000);

		let fastTimer: NodeJS.Timeout | null = null;

		const transitioningIds = instances
			.filter(ins => ['terminating', 'end_pending', 'start_pending'].includes(ins.status))
			.map(ins => ins.id);
			
		if (transitioningIds.length > 0) {
			fastTimer = setInterval(() => {
				transitioningIds.forEach(id => {          
					refreshSingleRef.current(id);
				});
			}, 5000);
		}

		return () => {
			clearInterval(slowTimer);
			if (fastTimer) clearInterval(fastTimer);
		};
		
	}, [isLoggedIn, isEnabled, statusFingerprint]);
};