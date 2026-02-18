const https = require('https');
const fs = require('fs');

const SUPABASE_URL = 'https://btuygwvelnioyavwrbxg.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dXlnd3ZlbG5pb3lhdndyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyOTk5NDcsImV4cCI6MjA4Njg3NTk0N30.whKka4iHrQQqGDxcCpvJ5TqbyjevbH3novxgW3CDmsg';

const LOG_FILE = 'jwks-debug.log';

function log(message) {
    console.log(message);
    fs.appendFileSync(LOG_FILE, message + '\n');
}

function fetch(url, headers = {}) {
    return new Promise((resolve) => {
        log(`\nFetching ${url}...`);
        const options = { headers };

        const req = https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                log(`Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    log(`SUCCESS. Response: ${data.substring(0, 150)}...`);
                    resolve({ ok: true, data: JSON.parse(data) });
                } else {
                    log(`FAILED. Response: ${data}`);
                    resolve({ ok: false, data });
                }
            });
        });

        req.on('error', (e) => {
            log(`ERROR: ${e.message}`);
            resolve({ ok: false, error: e });
        });
    });
}

async function run() {
    fs.writeFileSync(LOG_FILE, 'Starting JWKS Debug...\n');

    // 1. Try OIDC Discovery
    log('--- Step 1: OIDC Discovery ---');
    const oidcUrl = `${SUPABASE_URL}/auth/v1/.well-known/openid-configuration`;
    const oidcResult = await fetch(oidcUrl, { 'apikey': ANON_KEY });

    let jwksUrl = `${SUPABASE_URL}/auth/v1/jwks`; // Default
    if (oidcResult.ok && oidcResult.data.jwks_uri) {
        log(`\nFound JWKS URI in OIDC: ${oidcResult.data.jwks_uri}`);
        jwksUrl = oidcResult.data.jwks_uri;
    } else {
        log('\nOIDC Discovery failed or missing jwks_uri. Using default.');
    }

    // 2. Test the JWKS URL with credentials
    log(`\n--- Step 2: Testing JWKS URL: ${jwksUrl} ---`);

    // Attempt A: Open (no headers)
    log('Attempt A: No Headers');
    await fetch(jwksUrl);

    // Attempt B: ApiKey Header
    log('Attempt B: apikey Header');
    await fetch(jwksUrl, { 'apikey': ANON_KEY });

    // Attempt C: Authorization Header
    log('Attempt C: Authorization: Bearer Header');
    await fetch(jwksUrl, { 'Authorization': `Bearer ${ANON_KEY}` });

    // Attempt D: Both Headers
    log('Attempt D: Both Headers');
    await fetch(jwksUrl, { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` });

    log('\nFinished.');
}

run();
