const https = require('https');

const SUPABASE_URL = 'https://btuygwvelnioyavwrbxg.supabase.co';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dXlnd3ZlbG5pb3lhdndyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyOTk5NDcsImV4cCI6MjA4Njg3NTk0N30.whKka4iHrQQqGDxcCpvJ5TqbyjevbH3novxgW3CDmsg';

function checkUrl(url, headers = {}) {
    return new Promise((resolve) => {
        console.log(`Checking ${url}...`);
        const options = {
            headers: headers
        };
        https.get(url, options, (res) => {
            console.log(`Response from ${url}: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('SUCCESS: Got JWKS');
                    // console.log(data.substring(0, 100) + '...');
                } else {
                    console.log('FAILED:', data);
                }
                resolve();
            });
        }).on('error', (e) => {
            console.error(`Error fetching ${url}:`, e.message);
            resolve();
        });
    });
}

async function run() {
    console.log('Testing .well-known/jwks.json (Public)...');
    await checkUrl(`${SUPABASE_URL}/.well-known/jwks.json`);

    console.log('\nTesting /auth/v1/jwks (No Auth)...');
    await checkUrl(`${SUPABASE_URL}/auth/v1/jwks`);

    console.log('\nTesting /auth/v1/jwks (With apikey)...');
    await checkUrl(`${SUPABASE_URL}/auth/v1/jwks`, { 'apikey': ANON_KEY });

    console.log('\nTesting /rest/v1/auth/jwks (With apikey)...');
    await checkUrl(`${SUPABASE_URL}/rest/v1/auth/jwks`, { 'apikey': ANON_KEY });
}

run();
