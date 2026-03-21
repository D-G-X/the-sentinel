import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  headers: {
    'Connection': 'close'
  }
};

console.log("Testing health endpoint...");

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('BODY:', data);
    
    // Now test /analyze endpoint
    testAnalyze();
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});

req.end();

function testAnalyze() {
  console.log("\n\nTesting /analyze endpoint with empty body...");
  
  const postData = JSON.stringify({
    prFiles: [],
    architectRules: {}
  });
  
  const options2 = {
    hostname: 'localhost',
    port: 3000,
    path: '/analyze',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Connection': 'close'
    }
  };
  
  const req2 = http.request(options2, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('BODY:', data.substring(0, 500));
      process.exit(0);
    });
  });
  
  req2.on('error', (e) => {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  });
  
  req2.write(postData);
  req2.end();
}

setTimeout(() => {
  console.error('Timeout');
  process.exit(1);
}, 10000);
