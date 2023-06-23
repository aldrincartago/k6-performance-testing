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
        { target: 167, duration: "10m" }, //ramp-up
        { target: 167, duration: "10m" }, //sustained load
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
  // Exchange API Key
  let protectedExchangeUrl = baseURL + "/v2/key/apikeys/exchange";

  // Headers
  let protectedExchangeParams = {
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    },
  };

  // Payload
  let protectedExchangePayload = JSON.stringify({
    key: "71250604-9d62-44d2-86f9-c8f9849983ae",
  });

  const protectedRes = http.post(
    protectedExchangeUrl,
    protectedExchangePayload,
    protectedExchangeParams
  );

  check(protectedRes, {
    "Successfully exchanged API Key for a token": (r) => r.status === 200,
    "Exchange JWT is not empty": (r) => r.json().data.jwt != null,
  });

  sleep(1); // Sleep for 1 second between requests
}
