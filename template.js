import http from "k6/http";
import { check, sleep } from "k6";
import wasmPayload from "./wasm-payload";

const wasmURL =
  "https://excel.test.coherent.global/coherent/api/V3/folders/Regression%20Testing/services/PAR%20template_v3/Execute";
const loginUrl =
  "https://utilities.test.coherent.global/coherent/api/v1/internal/permission_elevation/elevate";

export function setup() {
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

  const res = http.post(loginUrl, tokenPayload, tokenParams);
  check(res, {
    "Elevate Token successful": (r) => r.status === 201,
  });

  return { jwt: res.json("data.jwt") };
  
}

export default function (jwt) {
  console.log(jwt);
  let params = {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "x-tenant-name": "coherent",
      "Content-Type": "application/json",
      Origin: "https://spark.test.coherent.global",
    },
  };

  let payload = JSON.stringify({
    request_data: {
      inputs: {
        Age: 40,
        Currency: "USD",
        Prem_freq: 1,
        Prem_term: 1,
        Sex: "M",
        Smoking: "NS",
        SumAssured: 20000,
      },
    },
    request_meta: {
      version_id: "f1c6a949-222f-4975-b903-d64d823b3652",
      call_purpose: "Spark - API Tester",
      source_system: "SPARK",
      correlation_id: "",
      requested_output: null,
      service_category: "",
      compiler_type: "Neuron",
    },
  });
  let wasmRes = http.post(wasmURL, payload, params);
  check(wasmRes, {
    "wasm-server Execute was successful": (r) => r.status === 200,
    "wasm-server response body is not empty": (r) =>
      r.json("response_data.outputs.Premium_Rate") != null,
  });
  console.log(wasmRes.json());
  sleep(1);
}
