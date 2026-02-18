import { useState, type FormEvent } from 'react';

interface AddNoteFormProps {
    onSubmit: (content: string) => void;
    isSubmitting?: boolean;
}

export const AddNoteForm = ({ onSubmit, isSubmitting = false }: AddNoteFormProps) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (content.trim()) {
            onSubmit(content.trim());
            setContent(''); // Clear form after submission
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Note</h3>

            <div className="mb-4">
                <label htmlFor="note-content" className="block text-sm font-medium text-gray-700 mb-2">
                    Note Content
                </label>
                <textarea
                    id="note-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter visit notes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    rows={4}
                    disabled={isSubmitting}
                    required
                />

            </div>

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => setContent('')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isSubmitting || !content.trim()}
                >
                    Clear
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    disabled={isSubmitting || !content.trim()}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                        </>
                    ) : (
                        'Add Note'
                    )}
                </button>
            </div>
        </form>
    );
};
