# AI-Powered Test Case Automation (Task 2)

## Project Overview

This project is an AI-powered browser automation tool that converts test cases written in plain English into executable browser actions.

It uses the Google Gemini API to understand natural language instructions and generate structured JSON actions. These actions are then executed using Playwright.

The solution is designed to work across different websites without being hardcoded to a particular webpage.

## Technology Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Automation Framework:** Playwright
- **AI Integration:** Google Gemini API
- **Dependencies:**
  - `@google/generative-ai`
  - `playwright`
  - `tsx`
  - `dotenv`

## Architecture

The project follows a modular architecture consisting of three main components.

### 1. AIGenerator

- Accepts test cases written in plain English.
- Sends instructions to the Google Gemini API.
- Uses a structured prompt to generate valid JSON actions.
- Supports actions such as navigation, filling fields, clicking buttons, selecting options, and verification.

### 2. PlaywrightRunner

- Receives the generated JSON actions.
- Validates and executes the actions using Playwright.
- Uses generic locators such as:
  - `getByRole()`
  - `getByPlaceholder()`
  - `getByLabel()`
  - `getByText()`
- Handles execution errors and element timeouts.

### 3. Reporting

- Displays execution progress in the terminal.
- Logs individual test steps.
- Generates a final PASS/FAIL result for each test case.

## Installation and Configuration

1. Clone the repository.
2. Ensure Node.js is installed.
3. Navigate to the project directory.
4. Install the dependencies:

```bash
npm install
```

5. Install the Chromium browser:

```bash
npx playwright install chromium
```

6. Create a `.env` file in the project root directory.
7. Add your Google Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

## How to Run

Execute the following command:

```bash
npx tsx index.ts
```

The application will:

1. Send the predefined natural language test cases to Gemini.
2. Receive structured JSON browser actions.
3. Launch Chromium using Playwright.
4. Execute the generated actions.
5. Verify the expected results.
6. Display the final PASS/FAIL report in the terminal.

## Key Features

- Natural language test case execution.
- AI-generated structured JSON actions.
- Generic browser automation.
- Dynamic element identification.
- Automated result verification.
- Error handling and execution reporting.
