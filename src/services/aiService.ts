const OPENAI_API_KEY = import.meta.env.VITE_AI_API_KEY;
const OPENAI_API_URL = import.meta.env.VITE_AI_API_URL;
const MODEL = import.meta.env.VITE_AI_MODEL;

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface IntentResult {
    intent: 'add_note' | 'summarize_notes' | 'filter_patients' | 'unknown';
    confidence: number;
    data: {
        patientId?: number;
        noteContent?: string;
        filterCriteria?: string;
        timeframe?: string;
    };
    response: string;
}

/**
 * Call OpenAI API with chat messages
 */
async function callOpenAI(messages: ChatMessage[]): Promise<string> {
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response from AI';
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}

/**
 * Parse user intent from natural language
 */
export async function parseIntent(userMessage: string): Promise<IntentResult> {
    const systemPrompt = `You are a specialized AI assistant for a patient management system. Your ONLY role is to handle these four intents: add_note, summarize_notes, filter_patients, or unknown.

Guidelines:
1. Strictly analyze the user message for these specific actions.
2. If the user asks about anything unrelated to patient management (e.g., personal questions, general knowledge, or off-topic conversation), categorize the intent as "unknown".
3. For "unknown" intent, the "response" property MUST inform the user that you only assist with patient management tasks.

Analyze strictly:
1. "add_note" - User wants to add a note. Extract:
   - patientId from patterns: "for userid: X", "for userId X", "for patient X", "patientId: X". If missing, set null.
   - noteContent as text after "add note:" before patient ID.
2. "summarize_notes" - User wants patient notes summary.
3. "filter_patients" - User wants to filter/search patients. Extract:
   - timeframe: "today", "this week", "this month".
   - filterCriteria: other description.
4. "unknown" - Anything else.

Respond ONLY in valid JSON format:
{
 "intent": "add_note|summarize_notes|filter_patients|unknown",
 "confidence": 0.0-1.0,
 "data": {
   "patientId": number | null,
   "noteContent": "text" | null,
   "filterCriteria": "text" | null,
   "timeframe": "today|this_week|this_month" | null
 },
 "response": "If unknown, strictly state: 'I am an AI assistant for patient management. I can only help with adding notes, summarizing, or filtering patients.' Otherwise, provide a concise action confirmation."
}
`;

    const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
    ];

    try {
        const aiResponse = await callOpenAI(messages);

        // Parse JSON response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return parsed;
        }

        // Fallback if JSON parsing fails
        return {
            intent: 'unknown',
            confidence: 0.5,
            data: {},
            response: aiResponse,
        };
    } catch (error) {
        console.error('Intent parsing error:', error);
        return {
            intent: 'unknown',
            confidence: 0,
            data: {},
            response: 'Sorry, I could not understand your request. Please try again.',
        };
    }
}

/**
 * Generate summary of patient notes
 */
export async function summarizeNotes(notes: Array<{ content: string; createdAt: string }>): Promise<string> {
    if (notes.length === 0) {
        return 'No notes available to summarize.';
    }

    const notesText = notes
        .map((note, idx) => `${idx + 1}. [${new Date(note.createdAt).toLocaleDateString()}] ${note.content}`)
        .join('\n');

    const systemPrompt = `You are a medical assistant. Summarize the following patient notes in a concise, professional manner. Focus on key symptoms, treatments, and progress.`;

    const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please summarize these patient notes:\n\n${notesText}` },
    ];

    try {
        const summary = await callOpenAI(messages);
        return summary;
    } catch (error) {
        console.error('Summary generation error:', error);
        return 'Unable to generate summary at this time.';
    }
}

/**
 * General chat with AI assistant
 */
export async function chatWithAI(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    const systemPrompt = `You are a strictly specialized assistant for a patient management system. 
You are NOT a general-purpose AI. 
If the user asks for anything other than patient-related tasks (adding notes, summaries, filtering), you must politely but firmly refuse and state that you only handle patient management system tasks.

Tasks you handle:
- Adding notes to specific patients
- Summarizing patient visit notes
- Filtering the patient list (by visit date, etc.)
- Answering how-to questions about this specific dashboard system.

If the user's message is off-topic (e.g., "what is your name", "tell me a joke", or using inappropriate language), respond strictly: "I am an AI assistant for patient management. I can only help you with patient-related tasks like adding notes, summaries, or filtering."`;

    const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
    ];

    try {
        const response = await callOpenAI(messages);
        return response;
    } catch (error) {
        console.error('Chat error:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}
