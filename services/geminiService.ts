
import { GoogleGenAI, Chat, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const createMathTutorChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `你叫"数学小博士" (Math Whiz)，是一个友善、充满活力且富有鼓励性的小学、初中及高中数学辅导老师（面向 6-18 岁的中国孩子）。
      - 请全程使用简体中文。
      - 使用简单的语言，根据孩子的年级调整语气（对小学生活泼，对中学生专业但亲切）。
      - 多使用表情符号 🌟🍎🚀。
      - 如果孩子要求出题，请生成一个适合他们年龄的有趣应用题（可以是代数、几何、微积分基础等）。
      - 如果他们卡住了，给出小的视觉提示或引导，不要直接给出答案。
      - 保持回答简练（通常在 100 字以内）。`,
    },
  });
};

export const generateMathExplanation = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `用两句话向一个学生解释数学概念 "${topic}"，最好使用一个比喻。请用中文回答。`,
    });
    return response.text || "我现在有点想不出来，不如我们先做练习吧！";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "哎呀！我的大脑正在打盹。稍后再试吧！";
  }
};

export interface WordProblem {
  question: string;
  options: string[]; // Multiple choice options
  answer: string;
  explanation: string;
}

export const generateWordProblem = async (grade: number): Promise<WordProblem | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a single math word problem for a Grade ${grade} student in China.
      
      Requirements by Grade:
      - Grade 1: Addition/Subtraction within 20, simple life scenarios (apples, toys).
      - Grade 2: Add/Sub within 100, basic multiplication concepts (groups).
      - Grade 3: Multi-digit add/sub, simple division, time, length, or money.
      - Grade 4: Larger numbers, mixed operations, rectangle area/perimeter application.
      - Grade 5: Decimals, average, equations (simple x), or polygon area application.
      - Grade 6: Fractions, Percentages, Ratios, Circle area/circumference, or speed/distance problems.
      - Grade 7 (初一): Rational numbers (negative numbers), One-variable linear equations, Basic Geometry (Angles, Lines).
      - Grade 8 (初二): Linear Inequalities, Functions (Linear), Triangles (Congruence), Whole number multiplication.
      - Grade 9 (初三): Quadratic Equations, Quadratic Functions, Circles, Trigonometry, Probability.
      - Grade 10 (高一): Sets, Functions (Monotonicity, Parity), Basic Probability, Vectors.
      - Grade 11 (高二): Derivatives (Tangents), Conic Sections (Ellipse, Hyperbola), Spatial Vectors.
      - Grade 12 (高三): Advanced Statistics, Complex Numbers, Integrals (Area under curve), Combinatorics.

      Return ONLY a valid JSON object with this schema:
      {
        "question": "The text of the word problem in Simplified Chinese",
        "options": ["Option A", "Option B", "Option C", "Option D"], // Array of 4 strings. Include the correct answer and 3 plausible distractors. Shuffle them.
        "answer": "The string that matches the correct option exactly",
        "explanation": "A friendly step-by-step explanation in Simplified Chinese suitable for the student's age"
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "answer", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as WordProblem;
  } catch (error) {
    console.error("Gemini Problem Gen Error:", error);
    return {
      question: "网络开小差了，请重试一下！",
      options: ["0", "1", "2", "3"],
      answer: "0",
      explanation: "请检查网络连接。"
    };
  }
};
