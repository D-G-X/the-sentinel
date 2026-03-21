import http from 'http';

const testPayload = {
  prFiles: [
    {
      filename: "src/utils/api.js",
      patch: "@@ -1,5 +1,6 @@\n import axios from 'axios';\n+import secrets from './secrets';\n\n export const apiKey = 'hardcoded-key-123';"
    }
  ],
  architectRules: {
    layers: {
      frontend: {
        allowedImports: ["react", "axios"],
        forbiddenImports: ["secrets", "database"]
      }
    }
  }
};

const postData = JSON.stringify(testPayload);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log("🧪 Testing /analyze endpoint...\n");

const req = http.request(options, (res) => {
  console.log(`✅ STATUS: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📦 RESPONSE BODY:');
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`❌ Problem with request: ${e.message}`);
  process.exit(1);
});

console.log("📤 Sending request with test data...\n");
req.write(postData);
req.end();

// Add timeout  
setTimeout(() => {
  console.error('\n⏱️ Request timed out after 30 seconds');
  process.exit(1);
}, 30000);
