import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  console.log("Connecting to Gemini API...");
  // Updated to the current actively supported 2.5-flash model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(
    "Return exactly this text: 'Connection Successful'",
  );
  console.log("Response:", result.response.text().trim());
}

testGemini();
