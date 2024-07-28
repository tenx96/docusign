import DemoApiClient, { handleExternalApi } from "./DemoApiClient";

export const demoApiGetTemplates = async ({ qs }) => {
  return (await DemoApiClient.get("/templates", { params: qs })).data;
};

export const demoApigetTemplateRecipients = async ({
    templateId
}) => {
  return (await DemoApiClient.get(`/templates/${templateId}/recipients`)).data;
};
