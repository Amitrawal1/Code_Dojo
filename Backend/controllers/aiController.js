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

    const prompt = `You are the "AI Gatekeeper", a strict and precise coding interviewer.
The user submitted ${language} code for "${problemTitle}".
Their code:
\`\`\`${language}
${userCode}
\`\`\`

Your ONLY task: analyze their exact code, identify a critical logical component (loop termination, pointer update, base case, state transition, time/space complexity), and generate ONE highly conceptual Multiple Choice Question (MCQ).

RULES:
1. Generate exactly 5 options. Only 1 correct.
2. The 4 incorrect options MUST represent common logical fallacies, off-by-one errors, or plausible misunderstandings. Make it impossible to guess without understanding the code.
3. Do NOT ask about syntax. Ask about logical execution and algorithmic consequences.
4. Do NOT hallucinate concepts not in the code.
5. Output ONLY valid JSON matching this schema:
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
