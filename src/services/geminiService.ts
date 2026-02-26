import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system';
import { Role } from '../context/RoleContext';

// Ensure you have EXPO_PUBLIC_GEMINI_API_KEY set in your .env file
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const processMedicalDocument = async (
    fileUri: string,
    mimeType: string,
    userRole: Role
): Promise<string> => {
    if (!apiKey) {
        throw new Error('Gemini API key is missing. Please check your .env file.');
    }

    try {
        // 1. Convert file to Base64 using expo-file-system
        const base64Data = await FileSystem.readAsStringAsync(fileUri, {
            encoding: 'base64',
        });

        // 2. Initialize the Gemini 1.5 Flash model
        // Using gemini-1.5-flash as it is fast and supports multimodal inputs
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // 3. Construct the dynamic prompt based on the user's role
        let rolePrompt = '';
        if (userRole === 'Doctor') {
            rolePrompt = 'You are an AI medical assistant. Extract the text from this document, analyze it, and output a structured clinical summary with key findings, potential diagnoses, and recommended next steps using professional medical terminology.';
        } else if (userRole === 'ASHA Worker') {
            rolePrompt = 'You are a healthcare assistant helping an ASHA worker. Extract the text and output simple, actionable steps. Highlight any red flags or dangerous signs. Keep it very simple and practical.';
        } else {
            rolePrompt = 'You are a friendly health assistant explaining a medical report to a patient. Extract the text and explain it in very simple, easy-to-understand terms. Avoid complex medical jargon. Reassure the patient and advise them to consult their doctor.';
        }

        const prompt = `${rolePrompt}\n\nAnalyze the provided document and give the appropriate summary.`;

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType,
            },
        };

        // 4. Call the model
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error processing document with Gemini:', error);
        throw error;
    }
};
