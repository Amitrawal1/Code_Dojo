// AI Controller — Gemini 1.5 Flash Socratic Gatekeeper

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
}

// @desc    Generate a logical question about user's code/approach
// @route   POST /api/ai/ask-question
export const askQuestion = async (req, res) => {
  try {
    const { problemTitle, problemDescription, userCode, language } = req.body;

    if (!problemTitle || !userCode) {
      return res.status(400).json({ message: "Problem title and user code are required." });
    }

    const prompt = `You are a Socratic coding gatekeeper for a DSA platform called "Code Dojo". 
When a student submits their code, you must ask them ONE short, logical question about their approach to verify they truly understand what they wrote. 
The question should be about: time/space complexity, edge cases, why they chose a particular data structure, or a conceptual question about the algorithm.
Keep it SHORT (1-2 sentences). Do NOT give away the answer. Only ask the question, nothing else.

Problem: "${problemTitle}"
Description: ${problemDescription}
Language: ${language}
Student's Code:
\`\`\`
${userCode}
\`\`\`

Ask ONE short logical question to verify the student understands their solution.`;

    const question = await callGemini(prompt);
    res.status(200).json({ question });
  } catch (error) {
    console.error("askQuestion error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Evaluate user's answer to the gatekeeper question
// @route   POST /api/ai/evaluate
export const evaluateAnswer = async (req, res) => {
  try {
    const { problemTitle, question, userAnswer, attemptNumber } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ message: "Question and answer are required." });
    }

    const prompt = `You are evaluating a student's answer to a coding concept question on "Code Dojo".
Judge if the student's answer is CORRECT or INCORRECT. Be lenient — accept answers that show genuine understanding even if not perfectly worded.
Respond ONLY in this JSON format (no markdown, no code blocks, no extra text):
{"correct": true, "feedback": "Great job! Your understanding is solid."}
or
{"correct": false, "feedback": "Not quite. Hint: think about what happens when the input is empty.", "hint": "Consider edge cases."}

Problem: "${problemTitle}"
Question asked: "${question}"
Student's answer: "${userAnswer}"
Attempt: ${attemptNumber}/3

Evaluate the answer. Respond ONLY with JSON.`;

    const aiResponse = await callGemini(prompt);
    
    // Parse JSON from AI response
    let result;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { correct: false, feedback: aiResponse };
    } catch {
      result = { correct: false, feedback: aiResponse };
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("evaluateAnswer error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
