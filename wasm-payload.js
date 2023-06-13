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