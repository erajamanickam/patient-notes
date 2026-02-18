import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePatients } from '../hooks/usePatients';
import { PatientCard } from '../components/PatientCard';
import { SkeletonList } from '../components/SkeletonCard';
import { CreatePatientModal } from '../components/CreatePatientModal';
import { UpdatePatientModal } from '../components/UpdatePatientModal';
import { AIChatWidget } from '../components/AIChatWidget';
import { createPatient, updatePatient, deletePatient } from '../services/patientService';
import type { CreatePatientPayload, UpdatePatientPayload, Patient } from '../types/patient';


export const PatientList = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    const queryClient = useQueryClient();
    const { data: patients, isLoading, isError, error } = usePatients();

    // Pagination logic
    const totalPatients = patients?.length || 0;
    const totalPages = Math.ceil(totalPatients / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPatients = patients?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Create patient mutation
    const createPatientMutation = useMutation({
        mutationFn: (payload: CreatePatientPayload) => createPatient(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            setIsCreateModalOpen(false);
        },
        onError: (error) => {
            console.error('Failed to create patient:', error);
            alert('Failed to create patient. Please try again.');
        },
    });

    // Update patient mutation
    const updatePatientMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdatePatientPayload }) =>
            updatePatient(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            setIsUpdateModalOpen(false);
            setSelectedPatient(null);
        },
        onError: (error) => {
            console.error('Failed to update patient:', error);
            alert('Failed to update patient. Please try again.');
        },
    });

    // Delete patient mutation
    const deletePatientMutation = useMutation({
        mutationFn: (id: number) => deletePatient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        },
        onError: (error) => {
            console.error('Failed to delete patient:', error);
            alert('Failed to delete patient. Please try again.');
        },
    });

    const handleCreatePatient = (payload: CreatePatientPayload) => {
        createPatientMutation.mutate(payload);
    };

    const handleUpdatePatient = (id: number, payload: UpdatePatientPayload) => {
        updatePatientMutation.mutate({ id, payload });
    };

    const handleEditClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsUpdateModalOpen(true);
    };

    const handleDeleteClick = (patient: Patient) => {
        if (window.confirm(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`)) {
            deletePatientMutation.mutate(patient.id);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <div className="h-10 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SkeletonList count={6} />
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-red-900">Error Loading Patients</h3>
                        <p className="mt-1 text-sm text-red-700">
                            {error instanceof Error ? error.message : 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Patient Dashboard
                        </h1>
                        <p className="text-lg text-gray-600">
                            Manage and view patient information and visit notes
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setIsCreateModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Patient
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                                <p className="text-2xl font-bold text-gray-900">{patients?.length || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Recent Visits</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {patients?.filter(p => p.lastVisitDate).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {patients?.reduce((sum, p) => sum + p.notes.length, 0) || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient List */}
                {patients && patients.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg
                            className="mx-auto h-16 w-16 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No patients found</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Get started by adding your first patient.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {paginatedPatients?.map((patient) => (
                                <PatientCard
                                    key={patient.id}
                                    patient={patient}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8 pb-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all ${currentPage === page
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create Patient Modal */}
            <CreatePatientModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                }}
                onSubmit={handleCreatePatient}
                isSubmitting={createPatientMutation.isPending}
            />

            {/* Update Patient Modal */}
            <UpdatePatientModal
                key={selectedPatient?.id || 'new'}
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedPatient(null);
                }}
                onSubmit={handleUpdatePatient}
                patient={selectedPatient}
                isSubmitting={updatePatientMutation.isPending}
            />

            {/* AI Chat Widget */}
            <AIChatWidget
                patients={patients}
                isModalOpen={isCreateModalOpen || isUpdateModalOpen}
            />
        </div>
    );
};

