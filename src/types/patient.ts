export interface Note {
    id: number;
    content: string;
    createdAt: string;
}

export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    lastVisitDate: string | null;
    notes: Note[];
    createdAt: string;
    updatedAt: string | null;
}

export interface PatientsResponse {
    patients: Patient[];
}

export interface AddNotePayload {
    content: string;
}

export interface UpdatePatientPayload {
    age?: number;
    phone?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    lastVisitDate?: string | null;
}

export interface CreatePatientPayload {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    lastVisitDate?: string;
}
