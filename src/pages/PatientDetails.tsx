import { useParams, Link } from 'react-router-dom';
import { usePatientDetails } from '../hooks/usePatientDetails';
import { NotesList } from '../components/NotesList';
import { AddNoteForm } from '../components/AddNoteForm';
import { AIChatWidget } from '../components/AIChatWidget';

export const PatientDetails = () => {
    const { id } = useParams<{ id: string }>();
    const patientId = parseInt(id || '0', 10);

    const { patient, isLoading, isError, error, addNote, isAddingNote } = usePatientDetails(patientId);

    const handleAddNote = (content: string) => {
        addNote({ content });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !patient) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <Link
                        to="/"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Patients
                    </Link>

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
                        <h3 className="mt-2 text-lg font-medium text-red-900">Error Loading Patient</h3>
                        <p className="mt-1 text-sm text-red-700">
                            {error instanceof Error ? error.message : 'Patient not found'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No visits yet';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Patients
                </Link>

                {/* Patient Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {patient.firstName} {patient.lastName}
                            </h1>
                            <p className="text-gray-600">Patient ID: #{patient.id}</p>
                        </div>
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-bold text-xl">
                            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <div>
                                <p className="text-xs text-gray-500">Age / Gender</p>
                                <p className="font-semibold text-gray-900">{patient.age} years / {patient.gender}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="font-semibold text-gray-900">{patient.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-semibold text-gray-900">{patient.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <p className="text-xs text-gray-500">Last Visit</p>
                                <p className="font-semibold text-gray-900">{formatDate(patient.lastVisitDate)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Note Form */}
                <div className="mb-6">
                    <AddNoteForm onSubmit={handleAddNote} isSubmitting={isAddingNote} />
                </div>

                {/* Notes Section */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Visit Notes ({patient.notes.length})
                    </h2>
                    <NotesList notes={patient.notes} />
                </div>

                {/* AI Chat Widget */}
                <AIChatWidget
                    currentPatientId={patientId}
                    isModalOpen={false}
                />

            </div>
        </div>
    );
};
