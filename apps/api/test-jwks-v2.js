const https = require('https');

const SUPABASE_URL = 'https://btuygwvelnioyavwrbxg.supabase.co';
// Taking the key directly from the previous .env view to be 100% sure
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dXlnd3ZlbG5pb3lhdndyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyOTk5NDcsImV4cCI6MjA4Njg3NTk0N30.whKka4iHrQQqGDxcCpvJ5TqbyjevbH3novxgW3CDmsg';

function checkUrl(name, url, headers = {}) {
    return new Promise((resolve) => {
        console.log(`\n[${name}] Testing...`);
        console.log(`URL: ${url}`);
        // console.log(`Headers: ${JSON.stringify(headers)}`);

        const options = {
            headers: headers
        };

        const req = https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`[${name}] Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    console.log(`[${name}] SUCCESS! Found keys.`);
                } else {
                    console.log(`[${name}] FAILED. Response: ${data.substring(0, 100)}`);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`[${name}] ERROR: ${e.message}`);
            resolve();
        });
    });
}

async function run() {
    // Test 1: Public .well-known
    await checkUrl('Public', `${SUPABASE_URL}/.well-known/jwks.json`);

    // Test 2: Auth V1 with apikey header
    await checkUrl('AuthV1_ApiKey', `${SUPABASE_URL}/auth/v1/jwks`, {
        'apikey': ANON_KEY
    });

    // Test 3: Auth V1 with Authorization header
    await checkUrl('AuthV1_Bearer', `${SUPABASE_URL}/auth/v1/jwks`, {
        'Authorization': `Bearer ${ANON_KEY}`
    });

    // Test 4: Auth V1 with BOTH
    await checkUrl('AuthV1_Both', `${SUPABASE_URL}/auth/v1/jwks`, {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
    });
}

run();
