import type { Patient, PatientsResponse, AddNotePayload, UpdatePatientPayload, CreatePatientPayload } from '../types/patient';
import { api } from './api';

/**
 * Get all patients
 */
export async function getPatients(): Promise<Patient[]> {
    const data = await api.get<PatientsResponse | Patient[]>('/patients');

    if (Array.isArray(data)) {
        return data;
    }

    if (data && typeof data === 'object' && 'patients' in data) {
        return data.patients || [];
    }

    return [];
}

/**
 * Get a single patient by ID
 */
export async function getPatientById(id: number): Promise<Patient> {
    return api.get<Patient>(`/patients/${id}`);
}

/**
 * Create a new patient
 */
export async function createPatient(payload: CreatePatientPayload): Promise<Patient> {
    return api.post<Patient>('/patients', payload);
}

/**
 * Add a note to a patient
 */
export async function addNote(patientId: number, payload: AddNotePayload): Promise<Patient> {
    return api.post<Patient>(`/patients/${patientId}/notes`, payload);
}

/**
 * Update patient information
 */
export async function updatePatient(id: number, payload: UpdatePatientPayload): Promise<Patient> {
    return api.put<Patient>(`/patients/${id}`, payload);
}

/**
 * Delete a patient
 */
export async function deletePatient(id: number): Promise<void> {
    return api.delete<void>(`/patients/${id}`);
}




