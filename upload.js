import { check, sleep } from 'k6'
import http from 'k6/http'
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js'
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'

export const options = {
  scenarios: {
    Exchange_API: {
      executor: "ramping-arrival-rate",
      startTime: "0s",
      gracefulStop: "30s",
      stages: [
        { target: 1, duration: "1m" }, //warm-up
        // { target: 250, duration: "10m" }, //ramp-up
        // { target: 250, duration: "10m" }, //sustained load
        // { target: 0, duration: "10m" }, //ramp-down
      ],
      preAllocatedVUs: 20,
      startRate: 1,
      timeUnit: "1s",
      maxVUs: 600,
    },
  },
};

// const baseURL = "https://excel.sit.coherent.global/coherent/api"; //SIT environment
const baseURL = "https://excel.test.coherent.global/coherent/api"; //Test environment
const excelfile = open('./JustInputs.xlsx', 'b'); //file path
const FolderName = "Homer_Test"; //folder name in Spark
const ServiceName = "JustInputs"; //filename of the excel to be uploaded

export default function () {
  let formData, UploadResponse
  
  var token = "Bearer eyJraWQiOiI5OTI4MTc4Zi01NDRkLTQwYTAtYTFkMy1iMzMyZDJiZGRiNWYiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJhMmIyYzY5Mi01ZjdkLTQ1ODgtOTk3Yi1mZGYwNTFmZGJiYmEiLCJzdWIiOiJhMmIyYzY5Mi01ZjdkLTQ1ODgtOTk3Yi1mZGYwNTFmZGJiYmEiLCJpc3MiOiJ1dGlsaXR5LXNlcnZpY2UiLCJhdWQiOiJ1dGlsaXR5LXNlcnZpY2UtdGVzdGluZyIsImlhdCI6MTY4NzI0MzYwNywiZXhwIjoxNjg3MjQ3MjA3LCJjcmVhdG9yLnVzZXJuYW1lIjoiQW5vbnltb3VzIiwibmJmIjoxNjg3MjQzNjA3LCJyZWFsbSI6ImNvaGVyZW50IiwiUHJveHlUb2tlbiI6IlRydWUiLCJTb3VyY2VSZXF1ZXN0Ijoic3BhcmsiLCJQdXJwb3NlIjoiZWxldmF0ZV9leGVjdXRlX3Blcm1pc3Npb24iLCJDb3JyZWxhdGlvbklkIjoiIiwiVXNlcklkIjoiIiwiT3JpZ2luYWxSZXF1ZXN0VXNlcklkIjoiIiwiZ3JvdXBzIjpbInN1cGVydmlzb3I6cGYiLCJ1c2VyOnBmIiwidGVuYW50LWFkbWluIl19.Nf8I1NH-cuGjuGo5CqHZ_Xotrqpj5NYVyB-rjuf2Gm91tKLQborsWq3j4RFIqd04-J4XfN4tLLd8iPLYFDdFhBxmVMK8LnBXCsHoNAND7VID65Va9RPwwVR-8MXEgNZ4whh364PHm5CSih7dkK039yqjieGe7R10tJERA4ighCUJejrP5j_bRVVu-K4ysmiZJkvSamv7Xp-h9tRbyOkaE8EkDP1QHBWO7xlHLoksv52HgkBSPW694UrS72M7J0gPeTvYqD-8pdNiN3kOlFRZ0hhNP93pupdllFKbkm4KfvMWKLvsD2QLAkNoY3mCz7_US8ihLJX7EtvYtkpd95436Q";

  // Step 1: Upload
  formData = new FormData()
  formData.append(
    'engineUploadRequestEntity',
    '{"request_data":{"version_difference":"minor","effective_start_date":"2023-06-05T04:04:39.558Z","effective_end_date":"2123-06-05T04:04:39.558Z"}}'
  )
  formData.append('serviceFile', http.file(excelfile, 'JustInputs.xlsx', 'multipart/form-data; boundary=' + formData.boundary));

  UploadResponse = http.post(
    baseURL + `/v3/folders/${FolderName}/services/${ServiceName}/upload`,
    formData.body(),
    {
      headers: {
        'x-tenant-name': 'coherent',
        Authorization:
          `${token}`,
        'Content-Type': 'multipart/form-data; boundary=' + formData.boundary,
      },
    }
  )

  var jobId = UploadResponse.json("response_data.nodegen_compilation_jobid");
  var OrigDocId = UploadResponse.json("response_data.original_file_documentid");
  var EngDocId = UploadResponse.json("response_data.engine_file_documentid");

  // console.log(UploadResponse.status, jobId, OrigDocId, EngDocId);
  check(UploadResponse, {
    'is upload status 200': (r) => r.status === 200,
  });

  //Step 2: Get Compilation Progess
  do {
  const ProgressResponse = http.get(
    baseURL + `/v3/folders/${FolderName}/services/${ServiceName}/getcompilationprogess/` + jobId,
    {
      headers: {
        'x-tenant-name': 'coherent',
        Authorization:
        `${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  var ProgressStatus = ProgressResponse.status;
  // console.log(ProgressResponse.status, ProgressResponse.url);
   check(ProgressResponse, {
     'is progress status 200': (r) => r.status === 200,
   });
  }
  while (ProgressStatus !== 200);

  //Step 3: Publish
  var RndmNum = randomIntBetween(1, 5); //randomIntBetween(min, max)
  const PublishResponse = http.post(
    baseURL + `/v3/folders/${FolderName}/services/${ServiceName}_${RndmNum}/publish`,
    JSON.stringify({
      request_data:{
        draft_service_name: `${ServiceName}_${RndmNum}`,
        effective_start_date: "2023-06-05T04:04:39.405Z",
        effective_end_date: "2123-06-05T04:04:39.405Z",
        original_file_documentid: `${OrigDocId}`,
        engine_file_documentid: `${EngDocId}`,
        version_difference: "minor",
        should_trck_user_action: "true"
      }
    }),
    {
      headers: {
        'x-tenant-name': 'coherent',
        Authorization: 
        `${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  // console.log(PublishResponse.status, PublishResponse.url, PublishResponse.request);
   check(PublishResponse, {
     'successful upload': (r) => r.status === 200,
   });

  // Automatically added sleep
  sleep(1)
}
