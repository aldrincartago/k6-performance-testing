import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const options = {
  scenarios: {
    Exchange_API: {
      executor: "ramping-arrival-rate",
      startTime: "0s",
      gracefulStop: "30s",
      stages: [
        { target: 1, duration: "1m" }, //warm-up
        { target: 20, duration: "10m" }, //ramp-up
        { target: 20, duration: "10m" }, //sustained load
        { target: 0, duration: "10m" }, //ramp-down
      ],
      preAllocatedVUs: 20,
      startRate: 1,
      timeUnit: "1s",
      maxVUs: 100000,
    },
  },
};

const baseURL = "https://utilities.test.coherent.global/coherent/api";

export default function () {
  // Step 1: Authenticate and get JWT
  let loginUrl = baseURL + "/v1/internal/permission_elevation/elevate";
  let tokenPayload = JSON.stringify({
    groups: ["tenant-admin"],
    source_system: "spark",
    call_purpose: "elevate_execute_permission",
    validity: "3600",
  });
  let tokenParams = {
    headers: {
      "X-Protection-Key":
        "f7114a45-e660-41ce-8cf7-c5339755e552-432c58d7-731c-4b03-9c51-4d30edc012ba",
      "Content-Type": "application/json",
    },
  };
  let loginRes = http.post(loginUrl, tokenPayload, tokenParams);
  check(loginRes, {
    "Elevate Token successful": (r) => r.status === 201,
  });

  // Extract JWT from response
  var jwt = loginRes.json("data.jwt");

  // Step 2: Use JWT to make multiple requests
  let protectedUrl = baseURL + "/v1/key/apikeys/synthetic";
  let protectedParams = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    },
  };
  //Step 3: Create API Key
  let randomGroupName = randomString(8);
  let protectedPayload = JSON.stringify({
    keyName: `AutomatedUser-${randomGroupName}`,
    keyDescription: "Automated API Testing - Smoke Test",
    groups: ["user:pf", "tenant-admin"],
    payload: { meta: "test" },
    expiresAt: "2026-01-01T07:00:00Z",
    activeFrom: "2023-01-01T07:00:00Z",
  });

  const protectedRes = http.post(
    protectedUrl,
    protectedPayload,
    protectedParams
  );
  check(protectedRes, {
    "API Key created successfully": (r) => r.status === 201,
    "API key is not null": (r) => r.json().data.apikey != null,
  });

  var apiKey = protectedRes.json().data.apikey;

  // Step 4: Exchange API Key
  let protectedExchangeUrl = baseURL + "/v2/key/apikeys/exchange";
  let protectedExchangeParams = {
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    },
  };

  //Loop
  for (let i = 0; i < 1; i++) {
    let protectedExchangePayload = JSON.stringify({
      key: `${apiKey}`,
    });

    const protectedRes = http.post(
      protectedExchangeUrl,
      protectedExchangePayload,
      protectedExchangeParams
    );
    check(protectedRes, {
      "Successfully exchanged API Key": (r) => r.status === 200,
      "JWT is not empty": (r) => r.json().data.jwt != null,
    });
    sleep(1); // Sleep for 1 second between requests
  }
}
