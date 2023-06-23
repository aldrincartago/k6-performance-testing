import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const options = {
  ext: {
    loadimpact: {
      distribution: {
        "amazon:sg:singapore": {
          loadZone: "amazon:sg:singapore",
          percent: 100,
        },
      },
      apm: [],
    },
  },
  thresholds: {},
  scenarios: {
    Exchange_API: {
      executor: "ramping-arrival-rate",
      startTime: "0s",
      gracefulStop: "30s",
      stages: [
        { target: 1, duration: "1m" }, //warm-up
        { target: 35, duration: "10m" }, //ramp-up
        { target: 35, duration: "20m" }, //sustained load
        { target: 0, duration: "10m" }, //ramp-down
      ],
      preAllocatedVUs: 20,
      startRate: 1,
      timeUnit: "1s",
      maxVUs: 999999,
      // exec: 'exchange_API',
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
}
