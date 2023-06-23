import http from "k6/http";
import { check } from "k6";

export default function() {
  let loginUrl =
    "https://utilities.test.coherent.global/coherent/api/v1/internal/permission_elevation/elevate";
  let tokenPayload = JSON.stringify({
    groups: ["supervisor:pf", "user:pf"],
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
  console.log(jwt);
  return jwt;
}
