import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Patient, UpdatePatientPayload } from '../types/patient';
import { validateEmail, validatePhone, isFutureDate } from '../utils/validation';

interface UpdatePatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: number, payload: UpdatePatientPayload) => void;
    patient: Patient | null;
    isSubmitting?: boolean;
}

interface InternalUpdatePatientPayload {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    lastVisitDate: string | null;
}

export const UpdatePatientModal = ({ isOpen, onClose, onSubmit, patient, isSubmitting = false }: UpdatePatientModalProps) => {
    const [formData, setFormData] = useState<InternalUpdatePatientPayload>({
        firstName: patient?.firstName || '',
        lastName: patient?.lastName || '',
        age: patient?.age || 0,
        gender: patient?.gender || 'Male',
        phone: patient?.phone || '',
        email: patient?.email || '',
        lastVisitDate: patient?.lastVisitDate || null,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
            newErrors.firstName = 'First name should only contain letters';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
            newErrors.lastName = 'Last name should only contain letters';
        }

        if (formData.email && !validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Phone number must be at least 10 digits';
        }

        if (formData.lastVisitDate && isFutureDate(formData.lastVisitDate)) {
            newErrors.lastVisitDate = 'Last visit date cannot be in the future';
        }

        if (formData.age < 0 || formData.age > 150) {
            newErrors.age = 'Age must be between 0 and 150';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validateForm() && patient) {
            onSubmit(patient.id, formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value,
        }));
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    if (!isOpen || !patient) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Update Patient</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isSubmitting}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name *
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                        </div>

                        {/* Age and Gender */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                    Age *
                                </label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age || ''}
                                    onChange={handleChange}
                                    min="0"
                                    max="150"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.age ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    required
                                    disabled={isSubmitting}
                                />
                                {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
                            </div>

                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender *
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                                disabled={isSubmitting}
                                placeholder="e.g. 1234567890"
                            />
                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Last Visit Date */}
                        <div>
                            <label htmlFor="lastVisitDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Visit Date
                            </label>
                            <input
                                type="date"
                                id="lastVisitDate"
                                name="lastVisitDate"
                                value={formData.lastVisitDate ? new Date(formData.lastVisitDate).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastVisitDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isSubmitting}
                            />
                            {errors.lastVisitDate && <p className="mt-1 text-xs text-red-500">{errors.lastVisitDate}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Patient'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
