const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Enhances user resume content using Gemini AI
 * @param {Object} userData - User data including profile, skills, projects, experience
 * @returns {Promise<Object>} Enhanced content for resume
 */
const enhanceResumeContent = async (userData) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a professional resume writer. Given the following user data, enhance and rewrite the content to be professional, impactful, and suitable for a resume that will pass ATS (Applicant Tracking Systems).

USER DATA:
- Name: ${userData.name || "Not provided"}
- Role/Title: ${userData.role || "Not provided"}
- Bio: ${userData.bio || "Not provided"}
- Location: ${userData.location || "Not provided"}
- Skills: ${userData.skills?.join(", ") || "Not provided"}

PROJECTS:
${
  userData.projects?.length > 0
    ? userData.projects
        .map(
          (p, i) => `${i + 1}. ${p.title}: ${p.description}${p.liveUrl ? ` (${p.liveUrl})` : ""}`
        )
        .join("\n")
    : "No projects provided"
}

EXPERIENCE:
${
  userData.experience?.length > 0
    ? userData.experience
        .map(
          (e, i) =>
            `${i + 1}. ${e.role} at ${e.company} (${new Date(e.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - ${e.endDate ? new Date(e.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present"})`
        )
        .join("\n")
    : "No experience provided"
}

Please provide enhanced content in the following JSON format ONLY (no markdown, no code blocks, just raw JSON):
{
  "summary": "A compelling 2-3 sentence professional summary based on the bio and overall profile",
  "skills": ["skill1", "skill2", ...],
  "projects": [
    {
      "title": "Project Title",
      "description": "Enhanced 1-2 sentence description highlighting impact and technologies"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "role": "Role Title",
      "description": "2-3 bullet points as a single string, each starting with an action verb, highlighting achievements and responsibilities"
    }
  ]
}

Rules:
1. Keep the original meaning but make it more professional and impactful
2. Use action verbs for experience descriptions
3. Highlight technologies, achievements, and quantifiable results where possible
4. Keep skills relevant and properly formatted
5. The summary should position the candidate as a strong professional
6. Return ONLY valid JSON, no other text`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const enhancedContent = JSON.parse(cleanedText);
    return enhancedContent;
  } catch (error) {
    console.error("Gemini API error:", error);
    // Return original content if AI enhancement fails
    return {
      summary: userData.bio || "Experienced professional seeking new opportunities.",
      skills: userData.skills || [],
      projects:
        userData.projects?.map((p) => ({
          title: p.title,
          description: p.description,
        })) || [],
      experience:
        userData.experience?.map((e) => ({
          company: e.company,
          role: e.role,
          description: `Worked as ${e.role} at ${e.company}.`,
        })) || [],
    };
  }
};

module.exports = { enhanceResumeContent };
