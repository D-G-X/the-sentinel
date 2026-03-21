import requests
import json

url = "http://localhost:3000/analyze"

payload = {
    "prFiles": [
        {
            "filename": "src/app.js",
            "patch": "@@ -1,3 +1,4 @@\nimport axios from 'axios';\n+const secret = 'sk-12345';\nconsole.log('hello');"
        }
    ],
    "architectRules": {
        "project": "test-app",
        "layers": {
            "frontend": {
                "allowedImports": ["react"],
                "forbiddenImports": ["secrets"]
            }
        }
    }
}

print("Testing /analyze endpoint...")
try:
    response = requests.post(url, json=payload, timeout=20)
    print(f"Status: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text[:500])
except requests.Timeout:
    print("Timeout after 20 seconds")
except Exception as e:
    print(f"Error: {e}")
