import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

export interface TestAction {
  action:
    | "navigate"
    | "click"
    | "fill"
    | "select"
    | "verifyText"
    | "verifyElement";
  target?: string;
  value?: string;
}

export class AIGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in .env file");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
  }

  async generateTestSteps(
    testCase: string,
    baseUrl: string,
  ): Promise<TestAction[]> {
    const prompt = `
You are a strict test automation compiler. Convert the user's natural language test case into a precise JSON array of browser actions.
Base URL: ${baseUrl}
Test Case: "${testCase}"

Allowed schema per object:
- { "action": "navigate", "value": "full URL or relative path based on Base URL" }
- { "action": "click", "target": "Exact visible text of the button or link" }
- { "action": "fill", "target": "Exact visible label or placeholder of the input", "value": "text to type" }
- { "action": "select", "target": "Exact visible label of dropdown", "value": "option to select" }
- { "action": "verifyText", "target": "element context", "value": "expected text to verify" }
- { "action": "verifyElement", "target": "Exact visible label to verify exists" }

Rules:
1. You must ONLY output a valid JSON array of objects.
2. For 'target', DO NOT include words like 'field', 'button', 'input', 'dropdown', or 'box'. Use ONLY the core label (e.g., use "Username" instead of "Username field").
3. Map logical steps efficiently.
`;
    const result = await this.model.generateContent(prompt);
    const text = result.response.text().trim();
    return JSON.parse(text) as TestAction[];
  }
}
