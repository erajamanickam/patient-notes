import type { Note } from '../types/patient';

interface NotesListProps {
    notes: Note[];
}

export const NotesList = ({ notes }: NotesListProps) => {
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (notes.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Get started by adding a new note below.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {[...notes]
                .sort((a, b) => b.id - a.id)
                .map((note) => (
                    <div
                        key={note.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <span className="text-xs text-gray-500 font-medium">
                                {formatDateTime(note.createdAt)}
                            </span>
                        </div>

                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {note.content}
                        </p>
                    </div>
                ))}
        </div>

    );
};
