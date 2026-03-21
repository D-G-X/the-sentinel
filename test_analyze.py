#!/usr/bin/env python3
import requests
import json
import sys

url = "http://localhost:3000/analyze"

payload = {
    "prFiles": [
        {
            "filename": "src/app.js",
            "patch": "@@ -1,3 +1,4 @@\n import axios from 'axios';\n+const secret = 'sk-12345';\n console.log('hello');"
        }
    ],
    "architectRules": {
        "project": "test-app",
        "layers": {
            "frontend": {
                "allowedImports": ["react", "axios"],
                "forbiddenImports": ["secrets", "database"]
            }
        }
    }
}

print("🧪 Testing /analyze endpoint...")
print(f"📤 Sending request to {url}")
print(f"📦 Payload: {len(json.dumps(payload))} bytes\n")

try:
    response = requests.post(url, json=payload, timeout=20)
    print(f"✅ Status Code: {response.status_code}")
    print(f"📋 Content-Type: {response.headers.get('content-type')}\n")
    print("📖 Response Body:")
    try:
        data = response.json()
        print(json.dumps(data, indent=2))
    except:
        print(response.text[:500])
except requests.Timeout:
    print("⏱️ Request timed out after 20 seconds")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
