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
        { target: 135, duration: "10m" }, //ramp-up
        { target: 135, duration: "10m" }, //sustained load
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
  "https://excel.test.coherent.global/coherent/api/v3/folders/Aldrin/services";

const token =
  "eyJraWQiOiI5OTI4MTc4Zi01NDRkLTQwYTAtYTFkMy1iMzMyZDJiZGRiNWYiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI2NjlkMGZjYi01N2U3LTRlZjMtOTIyOS03N2FhZWUyNjEzODEiLCJzdWIiOiI2NjlkMGZjYi01N2U3LTRlZjMtOTIyOS03N2FhZWUyNjEzODEiLCJpc3MiOiJ1dGlsaXR5LXNlcnZpY2UiLCJhdWQiOiJ1dGlsaXR5LXNlcnZpY2UtdGVzdGluZyIsImlhdCI6MTY4NzM0ODI4NiwiZXhwIjoxNjg3MzUxODg2LCJjcmVhdG9yLnVzZXJuYW1lIjoiQW5vbnltb3VzIiwibmJmIjoxNjg3MzQ4Mjg2LCJyZWFsbSI6ImNvaGVyZW50IiwiUHJveHlUb2tlbiI6IlRydWUiLCJTb3VyY2VSZXF1ZXN0Ijoic3BhcmsiLCJQdXJwb3NlIjoiZWxldmF0ZV9leGVjdXRlX3Blcm1pc3Npb24iLCJDb3JyZWxhdGlvbklkIjoiIiwiVXNlcklkIjoiIiwiT3JpZ2luYWxSZXF1ZXN0VXNlcklkIjoiIiwiZ3JvdXBzIjpbInN1cGVydmlzb3I6cGYiLCJ1c2VyOnBmIiwidGVuYW50LWFkbWluIl19.nLOGJycMnMmxJAo6RsTJ4x7iS4clacY-aWZ5KcWgxnnV7e-nbrqEXhFPzAqUaFk8K5cyN298iyp8IuxTANXDvEmvQJlocBaAMRwBMCfphbn2hyx-Ct-PEmBl_m2g3dXThUSM05m3zvQ_m8cyNarq9hXgGRh-nRFkQON_g2puKPx-JMUqp3N56AtLLEpFSHgsWO47YZ_F8T9SC64lD4RH3F_Hpi8gwJRmCLCauOok3dMO7KLjs3XEgWIXDedxjmDjOUQe5BYMaF9Hx6QfsTgScj6ssxtRagHAP1hoji7YO_PQcdu5pJHHuJy5tpDpU3HiN-CI2fly5qUrBV4UG_1dbA";

const params = {
  headers: {
    Authorization: `Bearer ${token}`,
    "x-tenant-name": "coherent",
    "Content-Type": "application/json",
    Origin: "https://spark.test.coherent.global",
  },
};

export function simple() {
  const endpoint = "/BasicService/Execute";
  const payload = JSON.stringify({
    request_data: {
      inputs: {
        Age: 90,
        dropdown: "Test",
        Sex: "F",
        TotalAmount: 5000,
        test: {
          "Test Xj 1": 11,
          "Test Xj 2": 22,
          "Test Xj 3": 33,
        },
      },
    },
    request_meta: {
      version_id: "a807b93c-6072-4002-8553-f365785602d4",
      call_purpose: "Spark - API Tester",
      source_system: "SPARK",
      correlation_id: "",
      requested_output: null,
      service_category: "",
      compiler_type: "Neuron",
    },
  });

  let wasmRes = http.post(baseURL.concat(endpoint), payload, params);
  check(wasmRes, {
    "Simple Execute was successful": (r) => r.status === 200,
  });
}

export function medium() {
  const endpoint = "/PAR template_v4/Execute";
  const payload = JSON.stringify({
    request_data: {
      inputs: {
        "Issue Age": 28,
        "Sex (M/F)": "M",
        "Premium Frequency (1/2/4/12)": 1,
        Currency: "HKD",
        "Smoking status (NS/S)": "NS",
        "Premium Term": 5,
        "Sum Assured": 50000,
      },
    },
    request_meta: {
      version_id: "a2774df6-7214-465d-a29c-772937169fa2",
      call_purpose: "Spark - API Tester",
      source_system: "SPARK",
      correlation_id: "",
      requested_output: null,
      service_category: "",
      compiler_type: "Neuron",
    },
  });

  let wasmRes = http.post(baseURL.concat(endpoint), payload, params);
  check(wasmRes, {
    "Medium Execute was successful": (r) => r.status === 200,
  });
}

export function complex() {
  const endpoint = "/Travel_DRE-Clean_Test/Execute";
  const payload = JSON.stringify({
    request_data: {
      inputs: {
        adults: "1 Adult(s)",
        age: 36,
        children: "0 Child(ren)",
        commission: 0.4,
        destination: "North America",
        duration: 7,
        excess: 250,
        leadtime: "0 to 7",
        medriskscore: 1,
        plan: "Domestic",
        tripcost: 5000,
      },
    },
    request_meta: {
      version_id: "70af0b65-9b7d-450a-bb3c-bdc3afc5cc09",
      call_purpose: "Spark - API Tester",
      source_system: "SPARK",
      correlation_id: "",
      requested_output: null,
      service_category: "",
      compiler_type: "Neuron",
    },
  });

  let wasmRes = http.post(baseURL.concat(endpoint), payload, params);
  check(wasmRes, {
    "Complex Execute was successful": (r) => r.status === 200,
  });
}

export default function () {
  // Returns a random integer from 1 to 3:
  let randomApp = Math.floor(Math.random() * 6) + 1;
  switch (randomApp) {
    case 1:
      simple();
      break;
    case 2:
      medium();
      break;
    case 3:
      complex();
      break;
    case 4:
      simple();
      medium();
      break;
    case 5:
      simple();
      complex();
    case 6:
      medium();
      complex();
      break;
    default:
      console.log("Error");
  }
  sleep(1);
}
