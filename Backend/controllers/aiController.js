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

// @desc    Generate an MCQ about user's code logic based on stage
// @route   POST /api/ai/ask-question
export const askQuestion = async (req, res) => {
  try {
    const { problemTitle, problemDescription, userCode, language, stage = 1 } = req.body;

    if (!problemTitle || !userCode) {
      return res.status(400).json({ message: "Problem title and user code are required." });
    }

    let difficultyInstruction = "";
    if (stage === 1) {
      difficultyInstruction = "STAGE 1 (EASY): Ask a basic conceptual question about the algorithm or general approach used in the code. Ensure it is very easy to answer for the author.";
    } else if (stage === 2) {
      difficultyInstruction = "STAGE 2 (MEDIUM): Ask a logic-based question involving time/space complexity or basic edge cases. Make it moderately challenging.";
    } else {
      difficultyInstruction = "STAGE 3 (HARD): Find the most mathematically complex, obscure, or critical line in their code and ask a deep theoretical question. This should be a hardcore test of understanding.";
    }

    const prompt = `You are the "AI Gatekeeper", an elite technical interviewer.
The system is verifying the user's ${language} code for "${problemTitle}".
Their code:
\`\`\`${language}
${userCode}
\`\`\`

Generate ONE MCQ to verify the user actually wrote and understands this code.
${difficultyInstruction}

CRITICAL RULES:
1. EXACTLY 5 OPTIONS: 1 correct answer and 4 distractors.
2. The 4 incorrect options must represent common misunderstandings.
3. Provide a 'hint' that gently guides the user to the correct answer WITHOUT giving it away.
4. Output ONLY valid JSON:
{"question":"string","options":["A","B","C","D","E"],"correctAnswerIndex":0,"explanation":"string","hint":"string"}`;

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
