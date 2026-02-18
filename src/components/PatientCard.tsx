import { Link } from 'react-router-dom';
import type { Patient } from '../types/patient';

interface PatientCardProps {
    patient: Patient;
    onEdit?: (patient: Patient) => void;
    onDelete?: (patient: Patient) => void;
}

export const PatientCard = ({ patient, onEdit, onDelete }: PatientCardProps) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No visits yet';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onEdit) onEdit(patient);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) onDelete(patient);
    };

    return (
        <div className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-400">
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
                {onEdit && (
                    <button
                        onClick={handleEdit}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Patient"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={handleDelete}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Patient"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            <Link to={`/patient/${patient.id}`} className="block">
                <div className="flex items-start justify-between mb-4 pr-20">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            {patient.firstName} {patient.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{patient.email}</p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold">
                        {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center text-sm">
                        <span className="text-gray-600 font-medium w-24">Age:</span>
                        <span className="text-gray-900">{patient.age} years</span>
                    </div>

                    <div className="flex items-center text-sm">
                        <span className="text-gray-600 font-medium w-24">Gender:</span>
                        <span className="text-gray-900">{patient.gender}</span>
                    </div>

                    <div className="flex items-center text-sm">
                        <span className="text-gray-600 font-medium w-24">Phone:</span>
                        <span className="text-gray-900">{patient.phone}</span>
                    </div>

                    <div className="flex items-center text-sm">
                        <span className="text-gray-600 font-medium w-24">Last Visit:</span>
                        <span className="text-gray-900">{formatDate(patient.lastVisitDate)}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            {patient.notes.length} {patient.notes.length === 1 ? 'note' : 'notes'}
                        </span>
                        <span className="text-blue-600 text-sm font-medium">
                            View Details →
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};
