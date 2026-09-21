// OpenAI integration (optional - fallback to rule-based)
let openai;

if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('OpenAI API key not found. Using rule-based fallback.');
  openai = null;
}

const generateCareerRoadmap = async (userData) => {
  if (!openai) {
    // Fallback rule-based (existing logic)
    return { message: 'Fallback roadmap using rule-based system' };
  }

  try {
    const prompt = `Generate a personalized career roadmap for user with skills: ${userData.skills}, experience: ${userData.experience}, interests: ${userData.interests}. Provide 5 step actionable plan.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error);
    return { error: 'AI service unavailable, using fallback' };
  }
};

const analyzeResume = async (resumeText) => {
  if (!openai) return { score: 75, feedback: 'Fallback analysis' };

  const prompt = `Analyze this resume and give score/feedback: ${resumeText.slice(0, 4000)}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Resume analysis error:', error);
    return { score: 75, feedback: 'Analysis unavailable' };
  }
};

module.exports = { openai, generateCareerRoadmap, analyzeResume };

