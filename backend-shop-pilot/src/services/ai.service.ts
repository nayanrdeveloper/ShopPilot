import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const AiService = {
    generateDescription: async (name: string, category: string): Promise<string> => {
        if (!genAI) {
            console.warn("⚠️ GEMINI_API_KEY is missing. Returning mock data.");
            return `[MOCK AI] Experience the ultimate ${category} with the new ${name}. Designed for performance and style. (Real AI requires GEMINI_API_KEY in .env)`;
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Write a compelling, professional, and exciting 2-sentence product description for a product name "${name}" in the category "${category}". Highlight its key benefits using persuasive sales language.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw new Error("Failed to generate description from AI.");
        }
    },

    generateSalesSummary: async (data: any): Promise<string> => {
        if (!genAI) {
            return `[MOCK AI SUMMARY] Revenue: $${data.totalRevenue}. Top Item: ${data.topSelling[0] || 'None'}. (Add GEMINI_API_KEY for real insights)`;
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `
            Act as a Retail Manager. Analyze this sales data for the week:
            - Total Revenue: $${data.totalRevenue}
            - Total Orders: ${data.totalOrders}
            - Top Selling Products: ${data.topSelling.join(", ")}
            - Low Stock Alerts: ${data.lowStock.join(", ")}

            Write a concise 3-bullet point summary for the store owner.
            1. Revenue Insight
            2. Inventory Action Item
            3. Sales Trend
        `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error("Gemini Summary Error:", error);
            // Log detailed error to file
            const fs = require('fs');
            const errObj = {
                message: error.message,
                stack: error.stack,
                response: error.response,
                status: error.status,
                statusText: error.statusText
            };
            try {
                fs.writeFileSync('gemini_error.log', JSON.stringify(errObj, null, 2));
            } catch (e) { /* ignore write error */ }

            throw new Error(`Failed to generate sales summary: ${error.message}`);
        }
    }
};
