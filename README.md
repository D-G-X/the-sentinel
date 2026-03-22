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

## Quick Testing

Run one of the included scripts while server is running:

```bash
node test-simple.js
node test-api.js
node test-analyze-endpoint.js
python3 test_api.py
python3 test_analyze.py
bash test-analyze.sh
```

## n8n Integration (PR Automation)

The file `src/n8n/n8n.json` contains a workflow template that:

1. Receives a GitHub PR webhook
2. Fetches changed PR files
3. Fetches and decodes `architecture.json` from the target repo
4. Sends both to Sentinel `/analyze`
5. Posts the resulting analysis as a GitHub PR comment

Important:

- The GitHub comment call uses an env-based auth header:
	- `Authorization: Bearer {{$env.GITHUB_TOKEN}}`
- Set `GITHUB_TOKEN` in your n8n environment, not in workflow JSON.

## Current Detection Coverage

- Architecture checks: LLM-driven via prompt + provided architecture rules
- Security checks:
	- `UNSAFE_JSON_PARSE` pattern detection
	- npm dependency vulnerability lookup using OSV

## Operational Notes

- The codebase uses ES module syntax (`import/export`).
- If Node warns about module type, add `"type": "module"` to `package.json` for cleaner runtime behavior.
- OSV lookups can increase analysis latency for large dependency lists.

## Future Improvements

- Expand static security rules (XSS, open redirect, insecure websockets, sensitive logging) and wire all rules into scanner
- Add unit/integration tests with assertions (current scripts are smoke tests)
- Add structured JSON output mode for downstream tools
- Add retry/backoff and better rate-limit handling for Gemini/OSV calls

## License

No license file is currently included in this repository.
