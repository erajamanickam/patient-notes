import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { ChatMessage, IntentResult } from '../services/aiService';
import { parseIntent, chatWithAI, summarizeNotes } from '../services/aiService';
import { useQueryClient } from '@tanstack/react-query';
import { getPatientById, addNote } from '../services/patientService';
import type { Patient } from '../types/patient';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AIChatWidgetProps {
    patients?: Patient[];
    currentPatientId?: number;
    isModalOpen?: boolean;
}

const INITIAL_MESSAGE: Message = {
    id: '1',
    role: 'assistant',
    content: 'Hello! 👋 I\'m your AI assistant.\n\nHow can I assist you today?',
    timestamp: new Date(),
};

export const AIChatWidget = ({ patients = [], currentPatientId, isModalOpen }: AIChatWidgetProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const location = useLocation();

    // Clear chat when navigating
    useEffect(() => {
        setMessages([INITIAL_MESSAGE]);
    }, [location.pathname]);

    // Close chat if a modal is opened anywhere
    useEffect(() => {
        if (isModalOpen && isOpen) {
            setIsOpen(false);
        }
    }, [isModalOpen, isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const addMessage = (role: 'user' | 'assistant', content: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            role,
            content,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        addMessage('user', userMessage);
        setIsLoading(true);

        try {
            // Parse user intent
            const intentResult = await parseIntent(userMessage);

            // Handle different intents
            switch (intentResult.intent) {
                case 'add_note':
                    await handleAddNote(intentResult, userMessage);
                    break;

                case 'summarize_notes':
                    await handleSummarizeNotes();
                    break;

                case 'filter_patients':
                    await handleFilterPatients(intentResult);
                    break;

                default: {
                    // General chat
                    const conversationHistory: ChatMessage[] = messages.slice(-5).map(m => ({
                        role: m.role,
                        content: m.content,
                    }));
                    const response = await chatWithAI(userMessage, conversationHistory);
                    addMessage('assistant', response);
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNote = async (intentResult: IntentResult, userMessage: string) => {
        let noteContent = intentResult.data.noteContent;

        if (!noteContent) {
            const noteMatch = userMessage.match(/add note:?\s*(.+?)(?:\s+for\s+(?:user|patient)?\s*id:?\s*\d+)?$/i);
            noteContent = noteMatch ? noteMatch[1].trim() : undefined;
        }

        if (!noteContent) {
            addMessage('assistant', 'Please specify the note content. Example: "Add note: patient reports headache"');
            return;
        }

        const targetPatientId = intentResult.data.patientId || currentPatientId;

        if (targetPatientId) {
            try {
                await addNote(targetPatientId, { content: noteContent });
                queryClient.invalidateQueries({ queryKey: ['patient', targetPatientId] });
                queryClient.invalidateQueries({ queryKey: ['patients'] });

                const patientName = patients?.find(p => p.id === targetPatientId);
                const patientInfo = patientName
                    ? ` to ${patientName.firstName} ${patientName.lastName}`
                    : targetPatientId === currentPatientId
                        ? ''
                        : ` to patient #${targetPatientId}`;

                addMessage('assistant', `✅ Note added successfully${patientInfo}: "${noteContent}"`);
            } catch (error) {
                console.error('Failed to add note:', error);
                addMessage('assistant', `❌ Failed to add note. Please check that patient #${targetPatientId} exists.`);
            }
        } else {
            addMessage('assistant', 'Please specify which patient to add the note to. Examples:\n• "Add note: patient reports fever, for userid: 3"\n• Or navigate to a patient details page first.');
        }
    };

    const handleSummarizeNotes = async () => {
        if (currentPatientId) {
            try {
                const patient = await getPatientById(currentPatientId);
                if (patient.notes.length === 0) {
                    addMessage('assistant', 'This patient has no notes to summarize.');
                    return;
                }

                addMessage('assistant', '🔄 Generating summary...');
                const summary = await summarizeNotes(patient.notes);

                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        content: `📋 **Patient Notes Summary**\n\n${summary}`,
                    };
                    return newMessages;
                });
            } catch (error) {
                console.error('Failed to summarize notes:', error);
                addMessage('assistant', '❌ Failed to generate summary. Please try again.');
            }
        } else {
            addMessage('assistant', 'Please navigate to a patient details page to summarize their notes.');
        }
    };

    const handleFilterPatients = async (intentResult: IntentResult) => {
        const { filterCriteria, timeframe } = intentResult.data;

        if (!patients || patients.length === 0) {
            addMessage('assistant', 'No patients available to filter.');
            return;
        }

        let filteredPatients = [...patients];

        if (timeframe === 'this_week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            filteredPatients = filteredPatients.filter(p =>
                p.lastVisitDate && new Date(p.lastVisitDate) >= oneWeekAgo
            );
        } else if (timeframe === 'today') {
            const today = new Date().toDateString();
            filteredPatients = filteredPatients.filter(p =>
                p.lastVisitDate && new Date(p.lastVisitDate).toDateString() === today
            );
        } else if (timeframe === 'this_month') {
            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            filteredPatients = filteredPatients.filter(p => {
                if (!p.lastVisitDate) return false;
                const visitDate = new Date(p.lastVisitDate);
                return visitDate.getMonth() === thisMonth && visitDate.getFullYear() === thisYear;
            });
        }

        if (filteredPatients.length === 0) {
            addMessage('assistant', `No patients found matching "${filterCriteria}".`);
        } else {
            const patientList = filteredPatients
                .map(p => `• ${p.firstName} ${p.lastName} - Last visit: ${p.lastVisitDate ? new Date(p.lastVisitDate).toLocaleDateString() : 'Never'}`)
                .join('\n');

            addMessage('assistant', `Found ${filteredPatients.length} patient(s):\n\n${patientList}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-50"
                    title="AI Assistant"
                >
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <div>
                                <h3 className="font-semibold">AI Assistant</h3>
                                <p className="text-xs opacity-90">Powered by GPT-4o-mini</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-800 border border-gray-200'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

