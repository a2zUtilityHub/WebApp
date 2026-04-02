import { useEffect } from 'react';
import { pageSeederService } from '@/services/pageSeederService';

export const useInitializePages = () => {
    useEffect(() => {
        const hasSeeded = localStorage.getItem('pages_seeded_v1');
        if (!hasSeeded) {
            pageSeederService.seedAllPages().then(() => {
                localStorage.setItem('pages_seeded_v1', 'true');
            });
        }
    }, []);
};