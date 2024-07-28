import DemoApiClient, { handleExternalApi } from "./DemoApiClient";

export const demoApicreateRecipientView = async ({
  envelopeId,
  data: { returnUrl, authenticationMethod, userName, email, clientUserId },
}) => {
  return handleExternalApi(
    DemoApiClient.post(`/envelopes/${envelopeId}/views/recipient`, {
      returnUrl,
      authenticationMethod,
      userName,
      email,
      clientUserId,
    })
  );
};

export const demoApiSenderView = async ({
  envelopeId,
  data: { returnUrl, viewAccess = "envelope" },
}) => {
  return handleExternalApi(
    DemoApiClient.post(`/envelopes/${envelopeId}/views/sender`, {
      returnUrl,
      viewAccess,
    })
  );
};


export const demoApiCorrectView = async ({
  envelopeId,
  data: { returnUrl, viewAccess = "envelope" },
}) => {
  return handleExternalApi(
    DemoApiClient.post(`/envelopes/${envelopeId}/views/correct`, {
      returnUrl,
      viewAccess,
    })
  );
};