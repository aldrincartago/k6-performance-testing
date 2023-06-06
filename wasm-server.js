import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const options = {
  stages: [
    { target: 1, duration: "1s" }, //warm-up
  ],
};

const baseURL = "https://excel.test.coherent.global/coherent/api";

export default function () {
  // Step 1: Authenticate and get JWT

  let wasmURL = baseURL + "/V3/folders/Sreedhar%20Test/services/Pi0/Execute";

  let params = {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJaeHVzMXg5eXo3MXNNd3JyVWVqNldwcWducms5cmZGWERINHRVNDN0QVBrIn0.eyJleHAiOjE2ODYwNjA3MTgsImlhdCI6MTY4NjA1MzUxOCwiYXV0aF90aW1lIjoxNjg2MDUzNTE3LCJqdGkiOiIwOTFjZTQ3OC03N2I3LTQxNjEtODE1My0yMWZhYzQ5YjdmYjMiLCJpc3MiOiJodHRwczovL2tleWNsb2FrLnRlc3QuY29oZXJlbnQuZ2xvYmFsL2F1dGgvcmVhbG1zL2NvaGVyZW50IiwiYXVkIjpbInByb2R1Y3QtZmFjdG9yeSIsImFjY291bnQiXSwic3ViIjoiMWY2MmE1NmYtNzFhMy00ZDI1LThjMzgtMDI2NjE1MGU0MWNlIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicHJvZHVjdC1mYWN0b3J5Iiwic2Vzc2lvbl9zdGF0ZSI6IjVkMmIxOWViLTEzYmQtNDA4MC05MjI5LWM4YTI2YmEwZWYxNyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9zYS5kZXYuY29oZXJlbnQuZ2xvYmFsIiwiaHR0cHM6Ly9zcGFyay11c2VyLW1hbmFnZXIudGVzdC5jb2hlcmVudC5nbG9iYWwiLCJodHRwczovL3NwYXJrLnRlc3QuY29oZXJlbnQuZ2xvYmFsIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9zcGFyay11c2VyLW1hbmFnZXIudGVzdC55ZWxsb3cuY29oZXJlbnQuZ2xvYmFsIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWNvaGVyZW50Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJzaWQiOiI1ZDJiMTllYi0xM2JkLTQwODAtOTIyOS1jOGEyNmJhMGVmMTciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkFsZHJpbiBDYXJ0YWdvIiwiZ3JvdXBzIjpbInN1cGVydmlzb3I6cGYiLCJ1c2VyOnBmIl0sInJlYWxtIjoiY29oZXJlbnQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhbGRyaW4uY2FydGFnb0Bjb2hlcmVudC5nbG9iYWwiLCJnaXZlbl9uYW1lIjoiQWxkcmluIiwiZmFtaWx5X25hbWUiOiJDYXJ0YWdvIiwiZW1haWwiOiJhbGRyaW4uY2FydGFnb0Bjb2hlcmVudC5nbG9iYWwifQ.XOAkxR3VPLzlx5rHCvKzLYXVaiNpaq4ls2yddeY82dV6n6c9DH2mIpch-gqPOOCjdbOqVY5TcrY340Zfx6CaK4tDQXIDx5LhLSgi-V3a_eIvfhqpSIyNLwyZ505k8f5ei51v96z06X6Ue4Xhy6wMf1KfFcpkTl8xmhxwW0UBNiYoHt4_LorumsVcFJINQQhDR6iBv0K1a9ibkz3aSGMIFi872m3OhTbjYzjiEv-H9Dnqhq73hSikEM4jhcLBDxl_FNuqHv48Nh53-sWHv9VBFGK7eCScFRQnDw2UeNOHZH6O2iKgI-FYqCkvbEusWmStdHqvlHK8F9if2v_T-XkT2g",
      "x-tenant-name": "coherent",
      "Content-Type": "application/json",
      Origin: "https://spark.test.coherent.global",
    },
  };

  let payload = JSON.stringify({
    request_data: {
      inputs: {},
    },
    request_meta: {
      version_id: "6a49049f-bb6f-40ed-a085-eae721518afa",
      call_purpose: "Spark - API Tester",
      source_system: "SPARK",
      correlation_id: "",
      requested_output: null,
      service_category: "",
      compiler_type: "Neuron",
    },
  });

  let loginRes = http.post(wasmURL, payload, params);

  check(loginRes, {
    "Elevate Token successful": (r) => r.status === 200,
  });

  console.log(loginRes.json().status);
}
