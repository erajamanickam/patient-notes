import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../services/patientService';

export const usePatients = () => {
    return useQuery({
        queryKey: ['patients'],
        queryFn: () => getPatients(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
    });
};

