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
      maxVUs: 10000,
    },
  },
};

const baseURL =
  "https://excel.test.coherent.global/coherent/api/V3/folders/Regression%20Testing/services/PAR%20template_v3/Execute";

const token =
  "eyJraWQiOiI5OTI4MTc4Zi01NDRkLTQwYTAtYTFkMy1iMzMyZDJiZGRiNWYiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIxNjMxN2U4My1iYjVmLTRmZTItODc4ZC0zYWVmMWE0YTg1NjciLCJzdWIiOiIxNjMxN2U4My1iYjVmLTRmZTItODc4ZC0zYWVmMWE0YTg1NjciLCJpc3MiOiJ1dGlsaXR5LXNlcnZpY2UiLCJhdWQiOiJ1dGlsaXR5LXNlcnZpY2UtdGVzdGluZyIsImlhdCI6MTY4NzIyNTU1OSwiZXhwIjoxNjg3MjI5MTU5LCJjcmVhdG9yLnVzZXJuYW1lIjoiQW5vbnltb3VzIiwibmJmIjoxNjg3MjI1NTU5LCJyZWFsbSI6ImNvaGVyZW50IiwiUHJveHlUb2tlbiI6IlRydWUiLCJTb3VyY2VSZXF1ZXN0Ijoic3BhcmsiLCJQdXJwb3NlIjoiZWxldmF0ZV9leGVjdXRlX3Blcm1pc3Npb24iLCJDb3JyZWxhdGlvbklkIjoiIiwiVXNlcklkIjoiIiwiT3JpZ2luYWxSZXF1ZXN0VXNlcklkIjoiIiwiZ3JvdXBzIjpbInN1cGVydmlzb3I6cGYiLCJ1c2VyOnBmIiwidGVuYW50LWFkbWluIl19.n0U97sgtASurDvsV5OKd8bICyj6yIqiD4hi4_mCu-OHVcm6WGUGzmf3o5fV20CvMbCVOuFEEZuZ0GWODJIw5D0imLmCKTXoNIFaLfZU4DLuUf6WVDvorPK6Tntm_6MD7h-ztHvPNNw4TNxN-HY9x5b49dqAYkPGXZeBQSaY-H8ZmA47ZZvXuAS2kf8paUG86jqiZmvtDMdlVeDHN8pYQZnPmFPWbXoaFTB9E8782sjn71JhRUSVxfmNV4pOaXdU2c26QV47arpn_wPqUg7kWfpTOBEAMdvKZ7Tm6aEGNXUAFtvmuJd-H4bi2Ronxvkp1jSupsAU2ejggKmxbqfb3yg";

const params = {
  headers: {
    Authorization: `Bearer ${token}`,
    "x-tenant-name": "coherent",
    "Content-Type": "application/json",
    Origin: "https://spark.test.coherent.global",
  },
};

const payload = JSON.stringify({
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

export default function () {
  let wasmRes = http.post(baseURL, payload, params);
  check(wasmRes, {
    "wasm-server Execute was successful": (r) => r.status === 200,
    "wasm-server response body is not empty": (r) =>
      r.json("response_data.outputs.Premium_Rate") != null,
  });
  sleep(1);
}
