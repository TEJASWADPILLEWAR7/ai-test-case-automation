import { chromium, type Browser, type Page } from "@playwright/test";
import type { TestAction } from "./AIGenerator.ts";

export class PlaywrightRunner {
  private async findElement(page: Page, target: string) {
    // Strip out generic words that might confuse the locator
    const cleanTarget = target
      .replace(/(field|button|input|box|dropdown)/gi, "")
      .trim();
    const lowerTarget = cleanTarget.toLowerCase();

    const locators = [
      page.getByPlaceholder(cleanTarget, { exact: false }),
      page.getByRole("button", { name: cleanTarget, exact: false }),
      page.getByRole("textbox", { name: cleanTarget, exact: false }),
      page.getByLabel(cleanTarget, { exact: false }),
      page.getByText(cleanTarget, { exact: false }),
      page.locator(`input[name*="${lowerTarget}" i]`),
      page.locator(`input[id*="${lowerTarget}" i]`),
    ];

    for (const locator of locators) {
      if ((await locator.count()) > 0) {
        return locator.first();
      }
    }

    return page.locator(cleanTarget).first();
  }

  async runTest(steps: TestAction[]): Promise<boolean> {
    console.log("\nStarting Playwright Execution...");
    const browser: Browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page: Page = await context.newPage();

    let passed = true;

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        console.log(
          `[Step ${i + 1}/${steps.length}] Executing: ${step.action} ${step.target ? "-> " + step.target : ""}`,
        );

        switch (step.action) {
          case "navigate":
            if (!step.value)
              throw new Error("Navigate action requires a value URL");
            await page.goto(step.value, { waitUntil: "networkidle" });
            break;

          case "fill":
            if (!step.target || !step.value)
              throw new Error("Fill action requires target and value");
            const fillEl = await this.findElement(page, step.target);
            await fillEl.waitFor({ state: "visible", timeout: 5000 });
            await fillEl.fill(step.value);
            break;

          case "click":
            if (!step.target) throw new Error("Click action requires a target");
            const clickEl = await this.findElement(page, step.target);
            await clickEl.waitFor({ state: "visible", timeout: 5000 });
            await clickEl.click();
            break;

          case "select":
            if (!step.target || !step.value)
              throw new Error("Select action requires target and value");
            const selectEl = await this.findElement(page, step.target);
            await selectEl.waitFor({ state: "visible", timeout: 5000 });
            await selectEl.selectOption({ label: step.value });
            break;

          case "verifyText":
            if (!step.value) throw new Error("VerifyText requires a value");
            const textEl = page.getByText(step.value, { exact: false }).first();
            await textEl.waitFor({ state: "visible", timeout: 5000 });
            break;

          case "verifyElement":
            if (!step.target)
              throw new Error("VerifyElement requires a target");
            const verifyEl = await this.findElement(page, step.target);
            await verifyEl.waitFor({ state: "visible", timeout: 5000 });
            break;

          default:
            throw new Error(`Unsupported action: ${step.action}`);
        }
        await page.waitForTimeout(1000);
      }
      console.log("\n✅ TEST REPORT: PASS");
      console.log("All generated steps executed and verified successfully.");
    } catch (error: any) {
      passed = false;
      console.log(`\n❌ TEST REPORT: FAIL`);
      console.log(`Execution stopped due to error: ${error.message}`);
    } finally {
      console.log("Closing browser...");
      await browser.close();
    }

    return passed;
  }
}
