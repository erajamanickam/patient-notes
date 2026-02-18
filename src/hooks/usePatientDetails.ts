import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatientById, addNote } from '../services/patientService';
import type { AddNotePayload, Patient } from '../types/patient';

export const usePatientDetails = (patientId: number) => {
    const queryClient = useQueryClient();

    // Fetch patient details
    const patientQuery = useQuery({
        queryKey: ['patient', patientId],
        queryFn: () => getPatientById(patientId),
        enabled: !!patientId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Add note mutation with optimistic updates
    const addNoteMutation = useMutation({
        mutationFn: (payload: AddNotePayload) =>
            addNote(patientId, payload),

        // Optimistic update
        onMutate: async (newNote) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['patient', patientId] });

            // Snapshot the previous value
            const previousPatient = queryClient.getQueryData(['patient', patientId]);

            // Optimistically update to the new value
            queryClient.setQueryData(['patient', patientId], (old: Patient | undefined) => {
                if (!old) return old;

                return {
                    ...old,
                    notes: [
                        ...old.notes,
                        {
                            id: Date.now(), // temporary ID
                            content: newNote.content,
                            createdAt: new Date().toISOString(),
                        },
                    ],
                    lastVisitDate: new Date().toISOString(),
                };
            });

            // Return context with the previous value
            return { previousPatient };
        },

        // On error, rollback to the previous value
        onError: (_err, _newNote, context) => {
            if (context?.previousPatient) {
                queryClient.setQueryData(['patient', patientId], context.previousPatient);
            }
            console.error('Failed to add note:', _err);
        },


        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        },
    });

    return {
        patient: patientQuery.data,
        isLoading: patientQuery.isLoading,
        isError: patientQuery.isError,
        error: patientQuery.error,
        addNote: addNoteMutation.mutate,
        isAddingNote: addNoteMutation.isPending,
    };
};

