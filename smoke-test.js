import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function() {
  // Step 1: Authenticate and get JWT
  let loginUrl = 'https://utilities.test.coherent.global/coherent/api/v1/internal/permission_elevation/elevate';
  let tokenPayload = JSON.stringify({
    groups: ['tenant-admin'],
    source_system: 'spark',
    call_purpose: 'elevate_execute_permission',
    validity: '3600'
  });
  let tokenParams = {
    headers: {
      'X-Protection-Key': 'f7114a45-e660-41ce-8cf7-c5339755e552-432c58d7-731c-4b03-9c51-4d30edc012ba',
      'Content-Type': 'application/json'
    },
  };
  let loginRes = http.post(loginUrl, tokenPayload, tokenParams);
  check(loginRes, {
    'status is 201': (r) => r.status === 201,
  });

  // Extract JWT from response
  let jwt = loginRes.json('data.jwt');

  // Step 2: Use JWT to make multiple requests
  let protectedUrl = 'https://utilities.test.coherent.global/coherent/api/v1/key/apikeys/synthetic';
  let protectedParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    },
  };

  // Make multiple requests to a protected endpoint
  for (let i = 0; i < 50; i++) {
    let randomGroupName = randomString(8);
    let protectedPayload = JSON.stringify({
      keyName: `AutomatedUser-${randomGroupName}`,
      keyDescription: 'Automated API Testing - Smoke Test',
      groups: ['user:pf', 'tenant-admin'],
      payload: { 'meta': 'test' },
      expiresAt: '2026-11-06T07:00:00Z',
      activeFrom: '2022-10-10T07:00:00Z'
    });

    const protectedRes = http.post(protectedUrl, protectedPayload, protectedParams);
    check(protectedRes, {
      'API Key created successfully': (r) => r.status === 201,
      'API key is not null': (r) => r.json().data.apikey != null,
    });
    console.log(protectedRes.json().data.apikey);

    sleep(1); // Sleep for 1 second between requests
  }
};