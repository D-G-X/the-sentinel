# The Sentinel

AI-assisted pull request review service for architecture and security checks.

The Sentinel exposes a backend API that receives PR file diffs and architecture rules, runs:

- Architecture analysis with Gemini
- Security scanning with static checks + OSV dependency lookups

It is designed to be called by an automation workflow (for example n8n), then post the final review back to GitHub as a PR comment.

## What It Does

- Accepts PR changed files and architecture rules via `POST /analyze`
- Produces architecture review findings with Gemini
- Detects selected security risks (currently `JSON.parse` usage + npm dependency vulnerability checks via OSV)
- Returns a single combined analysis payload ready to publish in PR comments

## Tech Stack

- Node.js + Express
- Google Gemini (`@google/generative-ai`)
- OSV API (`https://api.osv.dev/v1/query`)
- Optional orchestration via n8n workflow (`src/n8n/n8n.json`)

## Project Layout

```text
src/
	server.js                        # Express app entrypoint
	routes/analyze.route.js          # /analyze route
	controller/analyze.controller.js # Request validation + service orchestration
	services/architectService.js     # Architecture prompt generation + Gemini call
	services/securityService.js      # Security issue expansion + Gemini call
	gemini/gemini_2.5_API.js         # Gemini client wrapper
	tasks/security/
		scanner.js                     # Static checks + dependency vulnerability scan
		osv.service.js                 # OSV API integration
		rules/json.js                  # JSON.parse rule detector
		utils/helpers.js               # Shared helper functions
src/n8n/n8n.json                   # Example n8n workflow for GitHub PR automation

test-simple.js
test-api.js
test-analyze-endpoint.js
test_analyze.py
test_api.py
test-analyze.sh
```

## API

### `GET /`

Health endpoint.

Response:

```text
welcome to sentinel
```

### `POST /analyze`

Request body:

```json
{
  "prFiles": [
    {
      "filename": "src/app.js",
      "patch": "@@ -1,2 +1,3 @@\n+const x = JSON.parse(input);"
    }
  ],
  "architectRules": {
    "layers": {
      "frontend": {
        "allowedImports": ["react", "axios"],
        "forbiddenImports": ["secrets", "database"]
      }
    }
  }
}
```

Success response shape:

```json
{
  "success": true,
  "analysis": "...combined architecture and security review markdown..."
}
```

Validation errors:

- `400` if `prFiles` is missing/not an array
- `400` if `architectRules` is missing

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env` in project root:

```env
PORT=3000
GEMINI_API_KEY=your_google_api_key
GEMINI_MODEL_NAME=gemini-2.5-flash
GEMINI_TIMEOUT_MS=30000
```

Notes:

- `.env` is gitignored by default.
- Never commit API keys or tokens.

### 3. Start server

```bash
npm run dev
```

Server starts on `http://localhost:3000` by default.
