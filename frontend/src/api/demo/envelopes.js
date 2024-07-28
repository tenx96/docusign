import DemoApiClient, { handleExternalApi } from "./DemoApiClient";

export const demoApiGetEnvelopes = async ({ qs }) => {
  return handleExternalApi(DemoApiClient.get("/envelopes", { params: qs }));
};

export const demoApiCreateEnvelope = async ({ data }) => {
  return handleExternalApi(DemoApiClient.post("/envelopes", data));
};

export const demoApiGetEnvelope = async ({ envelopeId, qs }) => {
  return handleExternalApi(
    DemoApiClient.get(`/envelopes/${envelopeId}`, {
      params: qs || {},
    })
  );
};

export const demoApiDeleteEnvelopeRecipient = async ({ envelopeId, recipientId }) => {
    return handleExternalApi(DemoApiClient.delete(`/envelopes/${envelopeId}/recipients/${recipientId}`));
}

export const updateEnvelope = async ({ envelopeId, data }) => {
    return handleExternalApi(DemoApiClient.put(`/envelopes/${envelopeId}`, data));
}