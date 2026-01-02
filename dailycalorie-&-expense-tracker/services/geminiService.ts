
import { GoogleGenAI } from "@google/genai";
import { DailyData } from "../types";

export const analyzeConsumption = async (data: DailyData[]) => {
  // 按照 Coding Guidelines 直接使用 process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  if (data.length === 0) return "开始记录您的第一笔消耗吧，我会为您提供智能分析。";

  const summary = data.slice(-15).map(d => ({
    date: d.date,
    total: d.items.reduce((acc, curr) => acc + curr.amount, 0),
    details: d.items.map(i => `${i.name}(${i.amount})`).join(', ')
  }));

  const prompt = `你是一个专业的财务与健康分析助手。请根据用户过去15天的数据（如下），给出一个非常简短（50字以内）的中文习惯总结，并提供2条具体的改进建议。
  数据详情：${JSON.stringify(summary)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "分析已生成，请保持良好的记录习惯。";
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "智能助手正在休息中，请稍后再试。";
  }
};
