import http from "k6/http";
import { check, sleep } from "k6";
import payload from "./wasm-payload.js";

export const options = {
  scenarios: {
    Exchange_API: {
      executor: "ramping-arrival-rate",
      startTime: "0s",
      gracefulStop: "30s",
      stages: [
        { target: 1, duration: "3s" }, //warm-up
        { target: 300, duration: "5m" }, //ramp-up
        { target: 300, duration: "10m" }, //sustained load
        { target: 0, duration: "5m" }, //ramp-down
      ],
      preAllocatedVUs: 20,
      startRate: 1,
      timeUnit: "1s",
      maxVUs: 600,
    },
  },
};

const baseURL =
  "https://excel.test.coherent.global/coherent/api/V3/folders/Regression%20Testing/services/PAR%20template_v3/Execute";

export default function () {
  const token = "eyJraWQiOiI5OTI4MTc4Zi01NDRkLTQwYTAtYTFkMy1iMzMyZDJiZGRiNWYiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI3YjZlMmIxMS1hNWEzLTRmNTctOTk4OS1mNzA2NjJjYzdlNWUiLCJzdWIiOiI3YjZlMmIxMS1hNWEzLTRmNTctOTk4OS1mNzA2NjJjYzdlNWUiLCJpc3MiOiJ1dGlsaXR5LXNlcnZpY2UiLCJhdWQiOiJ1dGlsaXR5LXNlcnZpY2UtdGVzdGluZyIsImlhdCI6MTY4NjI4NjU1NSwiZXhwIjoxNjg2MjkwMTU1LCJjcmVhdG9yLnVzZXJuYW1lIjoiQW5vbnltb3VzIiwibmJmIjoxNjg2Mjg2NTU1LCJyZWFsbSI6ImNvaGVyZW50IiwiUHJveHlUb2tlbiI6IlRydWUiLCJTb3VyY2VSZXF1ZXN0Ijoic3BhcmsiLCJQdXJwb3NlIjoiZWxldmF0ZV9leGVjdXRlX3Blcm1pc3Npb24iLCJDb3JyZWxhdGlvbklkIjoiIiwiVXNlcklkIjoiIiwiT3JpZ2luYWxSZXF1ZXN0VXNlcklkIjoiIiwiZ3JvdXBzIjpbInN1cGVydmlzb3I6cGYiLCJ1c2VyOnBmIiwidGVuYW50LWFkbWluIl19.pospF0K0CPrevrM2Rtow5dNYL6gs9mZptB3_f4NhSwncttgcQbGzF5ckLvm3l47gk6-we6zN2smgRzfhFy9TnwODzmRIHUFaaFgJdyV9-4ck-WnJ-4JOeRpluPKa4BjntKDWeTd_ScFovM6TOLzlNHobrkxcE5hsDGXMXP_gwkdmw8fRt_lWolN61Ar9yi5CTJ1Vp186mu8iPN9gEltFCIh23WMbS50eg-yx71oEx3byzRL2BD5N90CqtToS8kdZMlm8YXeNo91JdW0w6mlWpimzqVUWB0FwYIKhzmQcsuQAcEiddEsDJOTgk4e49nFpO0oyh3-zFaLuea0VKt8yaw"
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-tenant-name": "coherent",
      "Content-Type": "application/json",
      Origin: "https://spark.test.coherent.global",
    },
  };

  let wasmRes = http.post(baseURL, payload, params);

  check(wasmRes, {
    "wasm-server Execute was successful": (r) => r.status === 200,
    "wasm-server response body is not empty": (r) =>
      r.json("response_data.outputs.Premium_Rate") != null,
  });

  sleep(1);
}
