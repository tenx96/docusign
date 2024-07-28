export class RecipientsQueryBuilder {
  constructor({ recipients }) {
    this._recipients = recipients; // [{recipientRole, name, email, clientUserId, block}]
  }

  getPayload = () => {
    // convert to type {[block]: [{role, name, email, clientUserId}]}
    const res = {};
    this._recipients?.forEach(({ recipientRole, name, email, clientUserId, block, recipientId }) => {
      if (!res[block]) {
        res[block] = [];
      }
      res[block].push({ roleName: recipientRole, name, email, clientUserId, recipientId: recipientId });
    });
    return res;
  };
}
