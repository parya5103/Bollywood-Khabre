const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

async function rewriteArticle(content, mode = "Professional") {
    const prompt = `
        Act as a professional SEO journalist. Rewrite this news.
        REQUIREMENTS:
        1. Tone: ${mode}.
        2. Format: Return a valid JSON object only, no markdown wrapper.

        OUTPUT FORMAT:
        {
          "headline": "SEO Catchy Title",
          "summary": "160 char summary",
          "full_article": "Markdown formatted news",
          "keywords": ["tag1", "tag2"],
          "score": 90
        }

        NEWS: ${content}
    `;

    try {
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: 'llama3', // Adjust based on installed models
            prompt: prompt,
            stream: false
        });

        const text = response.data.response;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
             return JSON.parse(jsonMatch[0].trim());
        }
        throw new Error("No JSON found in Ollama response");
    } catch (error) {
        console.error("Ollama AI Service Error:", error.message);
        return null;
    }
}

module.exports = { rewriteArticle };
