export class CreateEnvelopeQueryBuilder {
  constructor({ recipients, templateId, status="sent" }) {
    this._recipients = recipients;
    this._templateid = templateId;
    this._status = status;
  }

  getPayload = () => {
    return {
      compositeTemplates: [
        {
          compositeTemplateId: "1",
          inlineTemplates: [
            {
              recipients: this._recipients,
              sequence: "2",
            },
          ],
          serverTemplates: [
            {
              sequence: "1",
              templateId: this._templateid,
            },
          ],
        },
      ],
      status: this._status,
    };
  };
}
