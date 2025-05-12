"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePositiveQuote = generatePositiveQuote;
exports.generateMentalHealthReview = generateMentalHealthReview;
exports.processChatbotQuery = processChatbotQuery;
exports.generateMentalHealthAssessment = generateMentalHealthAssessment;
const inference_1 = require("@huggingface/inference");
// Initialize Huggingface client
const hf = new inference_1.HfInference(process.env.HUGGINGFACE_API_KEY || '');
/**
 * Generate a positive motivational quote
 */
async function generatePositiveQuote() {
    try {
        // Add some randomness to the prompt to ensure different quotes each time
        const promptVariations = [
            'Generate a positive and inspirational quote about mental health:',
            'Create an uplifting quote about mental wellness:',
            'Share a motivational quote about emotional wellbeing:',
            'Provide an inspiring quote about mental strength:',
            'Generate a positive quote about self-care and mental health:'
        ];
        // Select a random prompt variation
        const randomPrompt = promptVariations[Math.floor(Math.random() * promptVariations.length)];
        // Add a timestamp to further ensure uniqueness
        const uniquePrompt = `${randomPrompt} ${new Date().getTime()}`;
        const response = await hf.textGeneration({
            model: 'gpt2',
            inputs: uniquePrompt,
            parameters: {
                max_new_tokens: 100,
                temperature: 0.8, // Slightly increase temperature for more variation
                top_p: 0.95,
                repetition_penalty: 1.2,
            }
        });
        // Process and clean up the response by removing the prompt and timestamp
        let quoteText = response.generated_text;
        promptVariations.forEach(prompt => {
            quoteText = quoteText.replace(prompt, '');
        });
        // Remove any timestamp
        quoteText = quoteText.replace(/\d{13,}/, '');
        // Clean up the quote
        quoteText = quoteText.trim();
        return {
            quote: quoteText || "Every moment is a fresh beginning.",
            author: 'AI'
        };
    }
    catch (error) {
        console.error('Error generating quote:', error);
        return {
            quote: "The mind is like a parachute - it works best when it's open.",
            author: "Default Quote"
        };
    }
}
/**
 * Generate mental health review based on user data
 */
async function generateMentalHealthReview(userData) {
    try {
        // Prepare a prompt with user data
        const prompt = `Based on the following user data, provide a brief mental health analysis and 3 recommendations:
    - Average mood rating: ${userData.avgMood || 'N/A'}
    - Journal entries last week: ${userData.journalCount || 0}
    - Completed activities: ${userData.activitiesCompleted || 0}
    - Sleep quality average: ${userData.sleepQuality || 'N/A'}
    - Stress levels: ${userData.stressLevel || 'N/A'}
    
    Provide an analysis of their mental health status and specific recommendations for improvement.`;
        const response = await hf.textGeneration({
            model: 'gpt2',
            inputs: prompt,
            parameters: {
                max_new_tokens: 300,
                temperature: 0.7,
                top_p: 0.95,
            }
        });
        // Parse the response to extract analysis and recommendations
        const fullText = response.generated_text.replace(prompt, '').trim();
        // Simple parsing logic (can be improved)
        const parts = fullText.split('Recommendations:');
        const analysis = parts[0]?.trim() || 'Analysis not available.';
        let recommendations = [];
        if (parts[1]) {
            // Extract recommendations by looking for numbered or bullet points
            recommendations = parts[1]
                .split(/\d+\.|•|-/)
                .filter(item => item.trim().length > 0)
                .map(item => item.trim());
        }
        if (recommendations.length === 0) {
            recommendations = [
                'Practice mindfulness meditation daily',
                'Maintain a regular sleep schedule',
                'Connect with supportive friends or family'
            ];
        }
        return {
            analysis,
            recommendations
        };
    }
    catch (error) {
        console.error('Error generating mental health review:', error);
        return {
            analysis: 'Based on your recent activities and mood tracking, you appear to be maintaining a stable mental health routine.',
            recommendations: [
                'Consider adding a 5-minute mindfulness practice to your daily routine',
                'Try to get at least 7-8 hours of sleep each night',
                'Connect with supportive friends or family regularly'
            ]
        };
    }
}
/**
 * Process chatbot user query and generate a response
 */
async function processChatbotQuery(query) {
    try {
        const prompt = `You are a helpful mental health assistant in a wellness app called MindEase. 
    Provide a supportive, empathetic response to the following user query: ${query}`;
        const response = await hf.textGeneration({
            model: 'gpt2',
            inputs: prompt,
            parameters: {
                max_new_tokens: 150,
                temperature: 0.7,
                top_p: 0.95,
            }
        });
        return {
            response: response.generated_text.replace(prompt, '').trim()
        };
    }
    catch (error) {
        console.error('Error processing chatbot query:', error);
        return {
            response: "I'm here to help you navigate the MindEase app and support your mental wellness journey. How can I assist you today?"
        };
    }
}
/**
 * Generate mental health assessment based on user responses to a questionnaire
 */
async function generateMentalHealthAssessment(answers) {
    try {
        // Calculate simple scores
        const totalQuestions = Object.keys(answers).length;
        const sumScores = Object.values(answers).reduce((sum, score) => sum + score, 0);
        const averageScore = totalQuestions > 0 ? sumScores / totalQuestions : 0;
        // Prepare score ranges
        const scoreRanges = {
            low: averageScore < 2,
            moderate: averageScore >= 2 && averageScore < 3.5,
            high: averageScore >= 3.5
        };
        // Prepare a prompt with the scores
        const prompt = `Based on a mental health assessment with an average score of ${averageScore.toFixed(2)} out of 5,
    provide a brief analysis of the person's current mental health status and 3 specific recommendations.
    Their score is considered ${scoreRanges.low ? 'low' : scoreRanges.moderate ? 'moderate' : 'high'}.`;
        const response = await hf.textGeneration({
            model: 'gpt2',
            inputs: prompt,
            parameters: {
                max_new_tokens: 300,
                temperature: 0.7,
                top_p: 0.95,
            }
        });
        // Extract and structure the response
        const analysisText = response.generated_text.replace(prompt, '').trim();
        return {
            score: averageScore.toFixed(2),
            scoreLevel: scoreRanges.low ? 'low' : scoreRanges.moderate ? 'moderate' : 'high',
            analysis: analysisText,
            recommendations: [
                'Practice regular mindfulness or meditation',
                'Maintain a consistent sleep schedule',
                'Engage in physical activity regularly'
            ],
            timestamp: new Date().toISOString()
        };
    }
    catch (error) {
        console.error('Error generating mental health assessment:', error);
        // Fallback response
        return {
            score: (3).toFixed(2),
            scoreLevel: 'moderate',
            analysis: 'Based on your responses, you appear to be experiencing moderate levels of stress. This is a common experience, and there are several strategies that can help you manage and reduce these feelings.',
            recommendations: [
                'Practice regular mindfulness or meditation',
                'Maintain a consistent sleep schedule',
                'Engage in physical activity regularly'
            ],
            timestamp: new Date().toISOString()
        };
    }
}
