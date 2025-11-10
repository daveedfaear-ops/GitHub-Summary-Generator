
import { GoogleGenAI } from "@google/genai";
import { GitHubUrlParts } from "../types";

function getPromptForType(type: GitHubUrlParts['type'], name: string, content: string): string {
    const truncatedContent = content.substring(0, 30000); // Increased limit for better context
    switch (type) {
        case 'repo':
            return `
                Please act as an expert software engineer reviewing a project.
                Summarize the following GitHub repository content, which includes its README and a list of recent open issues.
                Focus on:
                1. The project's main purpose and functionality based on the README.
                2. The current development status or areas of focus, as indicated by the open issues.
                The summary should give a developer a quick, high-level understanding of the project.

                CONTENT FROM REPOSITORY '${name}':
                ---
                ${truncatedContent}
                ---
            `;
        case 'issue':
        case 'pr':
            const itemType = type === 'issue' ? 'issue thread' : 'pull request discussion';
            return `
                Please act as an expert software engineer analyzing a discussion.
                Summarize the following GitHub ${itemType}, including the original post and all comments.
                Focus on:
                1. What is the core problem or proposed change?
                2. What are the key points, suggestions, or feedback from the comments?
                3. What is the current status or conclusion of the discussion?
                The summary should be concise and capture the essence of the conversation.

                CONTENT FROM ${name}:
                ---
                ${truncatedContent}
                ---
            `;
        case 'file':
            return `
                Please act as an expert software engineer.
                Provide a concise summary of the following content from a GitHub file named '${name}'.
                Focus on its primary purpose, key functionalities, and overall structure.
                The summary should be easy to understand for another developer at a glance. Explain what the code does.
                
                CONTENT:
                ---
                ${truncatedContent}
                ---
            `;
        default:
            return `Summarize this content: ${truncatedContent}`;
    }
}

export async function summarizeContent(content: string, type: GitHubUrlParts['type'], name:string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.5-flash';
  const prompt = getPromptForType(type, name, content);

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    if (!response.text) {
        throw new Error("The API returned an empty summary. The content might be too short or unsupported.");
    }
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Propagate a more user-friendly error message
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error('Your Gemini API key is not valid. Please check it and try again.');
    }
    throw new Error("Failed to generate summary due to an API error.");
  }
}
