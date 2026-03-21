#!/bin/bash
node src/server.js > /tmp/server.log 2>&1 &
SERVER_PID=$!
sleep 3

echo "Testing /analyze endpoint..."
curl -s -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{}' | jq . 2>/dev/null || curl -s -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{}'

echo ""
echo "Server logs:"
head -20 /tmp/server.log

kill $SERVER_PID 2>/dev/null
