import { AIGenerator } from "./AIGenerator.ts";

async function testGeneration() {
  console.log("Sending test case to Gemini...");
  const ai = new AIGenerator();

  const testCase =
    "Navigate to the home page. Fill in the email address with 'admin@phptravels.com' and the password with 'demoadmin'. Click the submit login button. Verify that 'Dashboard' text is visible.";
  const baseUrl = "https://phptravels.com/demo";

  try {
    const steps = await ai.generateTestSteps(testCase, baseUrl);
    console.log("Successfully generated JSON steps:");
    console.log(JSON.stringify(steps, null, 2));
  } catch (error) {
    console.error("Failed to generate steps:", error);
  }
}

testGeneration();
