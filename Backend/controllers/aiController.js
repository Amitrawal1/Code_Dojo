// AI Controller — MCQ Gatekeeper System
// Single API call generates an MCQ; answer is verified client-side (zero extra tokens)

let currentKeyIndex = 0;

async function callGemini(prompt) {
  const keys = (process.env.GEMINI_API_KEYS || "").split(",").map(k => k.trim()).filter(k => k);
  
  if (keys.length === 0) {
    throw new Error("No Gemini API keys found in .env. Please add GEMINI_API_KEYS.");
  }

  for (let attempt = 0; attempt < keys.length; attempt++) {
    const apiKey = keys[currentKeyIndex];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.8, 
            maxOutputTokens: 400,
            responseMimeType: "application/json"
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      }

      if (response.status === 429) {
        console.warn(`⚠️ Key ${currentKeyIndex + 1} exhausted. Rotating...`);
        currentKeyIndex = (currentKeyIndex + 1) % keys.length;
        continue; 
      }

      throw new Error(`Gemini API Error: ${response.status} - ${data.error?.message || "Unknown"}`);

    } catch (error) {
      if (attempt === keys.length - 1) throw error;
      console.error(`Error with key ${currentKeyIndex + 1}:`, error.message);
      currentKeyIndex = (currentKeyIndex + 1) % keys.length;
    }
  }
}

// @desc    Generate an MCQ about user's code logic
// @route   POST /api/ai/ask-question
export const askQuestion = async (req, res) => {
  try {
    const { problemTitle, problemDescription, userCode, language } = req.body;

    if (!problemTitle || !userCode) {
      return res.status(400).json({ message: "Problem title and user code are required." });
    }

    const prompt = `You are the "AI Gatekeeper", an elite, uncompromising technical interviewer for an advanced campus coding platform.
The system has flagged this ${language} code for "${problemTitle}" as HIGHLY SUSPICIOUS (potential copy-paste). Trigger HARDCORE MODE.
Their code:
\`\`\`${language}
${userCode}
\`\`\`

Generate ONE extremely difficult MCQ to verify the user actually wrote and understands this code.

CRITICAL HARDCORE RULES:
1. NO BASIC QUESTIONS: Ignore simple loops, variable initializations, or basic syntax.
2. TARGET COMPLEXITY: Find the most mathematically complex, obscure, or critical line in their code (e.g., a complex pointer swap, a DP state transition equation, a bitwise operation, or an edge-case return statement).
3. THE QUESTION: Ask a deep, theoretical "Why exactly this?" or "What breaks if this specific math/logic is altered?" question.
4. EXACTLY 5 OPTIONS: 1 correct answer and 4 distractors.
5. THE TRAP DISTRACTORS: The 4 incorrect options MUST be trap answers designed to catch copy-pasters. They should use advanced technical jargon and sound highly plausible, representing common misunderstandings of that specific algorithm. Make it impossible to guess.
6. Output ONLY valid JSON:
{"question":"string","options":["A","B","C","D","E"],"correctAnswerIndex":0,"explanation":"string"}`;

    const aiResponse = await callGemini(prompt);
    
    let mcq;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      mcq = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      mcq = null;
    }

    // Validate MCQ structure
    if (!mcq || !mcq.question || !Array.isArray(mcq.options) || mcq.options.length !== 5 || typeof mcq.correctAnswerIndex !== 'number') {
      return res.status(500).json({ message: "AI generated invalid MCQ format. Please retry." });
    }

    res.status(200).json(mcq);
  } catch (error) {
    console.error("askQuestion error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify MCQ answer (client-side check, but this endpoint exists as a backup/logging)
// @route   POST /api/ai/evaluate
export const evaluateAnswer = async (req, res) => {
  try {
    const { selectedIndex, correctAnswerIndex, explanation } = req.body;

    if (typeof selectedIndex !== 'number' || typeof correctAnswerIndex !== 'number') {
      return res.status(400).json({ message: "selectedIndex and correctAnswerIndex are required." });
    }

    const correct = selectedIndex === correctAnswerIndex;

    res.status(200).json({ 
      correct, 
      feedback: correct 
        ? "✅ Correct! Your understanding of this code is verified." 
        : `❌ Incorrect. ${explanation || 'Review your code logic and try again.'}` 
    });
  } catch (error) {
    console.error("evaluateAnswer error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
