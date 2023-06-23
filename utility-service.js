import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    Exchange_API: {
      executor: "ramping-arrival-rate",
      startTime: "0s",
      gracefulStop: "30s",
      stages: [
        { target: 1, duration: "1m" }, //warm-up
        { target: 250, duration: "10m" }, //ramp-up
        { target: 250, duration: "10m" }, //sustained load
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
    key: "88ee7af6-8a13-47c8-94e5-ffc572e0daa5",
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
