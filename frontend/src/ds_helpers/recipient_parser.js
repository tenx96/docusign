/**
 * {
    "signers": [
        {
            "creationReason": "sender",
            "requireUploadSignature": "false",
            "name": "Mairingdao Hojai",
            "email": "mairingdao@gmail.com",
            "recipientId": "1",
            "recipientIdGuid": "4cf38d3d-0a5b-4cb8-b834-a6c9e9c01fbb",
            "requireIdLookup": "false",
            "userId": "194ce853-b5e4-463b-a547-3546a5b4705c",
            "routingOrder": "1",
            "roleName": "Signer 1",
            "status": "sent",
            "completedCount": "0",
            "sentDateTime": "2024-07-26T17:41:31.7530000Z",
            "deliveryMethod": "email",
            "recipientType": "signer"
        }
    ],
    "agents": [],
    "editors": [],
    "intermediaries": [],
    "carbonCopies": [],
    "certifiedDeliveries": [],
    "inPersonSigners": [],
    "seals": [],
    "witnesses": [],
    "notaries": [],
    "recipientCount": "1",
    "currentRoutingOrder": "1"
}
 */
export class RecipientParser {
  constructor(recipient) {
    this.recipient = recipient;
    this.roleToBlockMap = Object?.keys(recipient || {}).reduce((acc, key) => {
      if (Array.isArray(recipient[key])) {
        recipient[key].forEach((r) => {
          if (!acc[r.roleName]) {
            acc[r.roleName] = {
                block: key,
                ...r
            };
          }
        });
      }
      return acc;
    }, {});
  }

  flattenRecipients() {
    const res = [];
    if (this.recipient) {
      Object.keys(this.recipient).forEach((key) => {
        if (Array.isArray(this.recipient[key])) {
          this.recipient[key].forEach((recipient) => {
            res.push({
              name: recipient.name,
              email: recipient.email,
              role: recipient.roleName,
              recipientType: recipient.recipientType,
              status: recipient.status,
              recipientId: recipient.recipientId,
              block: key,
              clientUserId: recipient.clientUserId,
            });
          });
        }
      });
    }

    return res;
  }

  getRecipient() {
    return this.recipient;
  }
}
