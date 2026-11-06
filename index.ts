import { AIGenerator } from "./AIGenerator.ts";
import { PlaywrightRunner } from "./PlaywrightRunner.ts";

async function runTestCase(name: string, baseUrl: string, testCase: string) {
  console.log(`\n=========================================`);
  console.log(`RUNNING TEST: ${name}`);
  console.log(`Target URL: ${baseUrl}`);
  console.log(`Test Case: "${testCase}"`);
  console.log(`=========================================\n`);

  try {
    console.log("1. Requesting structured instructions from Gemini...");
    const ai = new AIGenerator();
    const steps = await ai.generateTestSteps(testCase, baseUrl);

    console.log("2. Validating generated steps...");
    if (!steps || steps.length === 0) {
      throw new Error("AI returned empty steps.");
    }

    const runner = new PlaywrightRunner();
    await runner.runTest(steps);
  } catch (error) {
    console.error("\nCRITICAL FAILURE:", error);
  }
}

async function main() {
  const phpTravelsUrl = "https://phptravels.com/demo";
  const phpTravelsTest =
    "Navigate to the home page. Enter 'Tejas' into the First Name field. Enter 'tejas@example.com' into the Email field. Verify that the text 'Last Name' appears on the page.";

  const sauceDemoUrl = "https://www.saucedemo.com/";
  const sauceDemoTest =
    "Navigate to the home page. Enter 'standard_user' into the Username field and 'secret_sauce' into the Password field. Click the Login button. Verify that the text 'Products' appears.";

  await runTestCase("PHPTravels Form Test", phpTravelsUrl, phpTravelsTest);
  await runTestCase("SauceDemo Login Test", sauceDemoUrl, sauceDemoTest);
}

main();
