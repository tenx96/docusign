import React from "react";
import EachRecipient from "./EachRecipient";

const RecipientBox = ({ recipients, label, envelopeId, onDeleteSuccess, roles, onChangeRole }) => {
  return (
    <div>
      <h3>{label}</h3>
      {recipients.map((data) => (
        <EachRecipient
          envelopeId={envelopeId}
          recipient={data}
          onDeleteSuccess={onDeleteSuccess}
          roles={roles}
          onChangeRole={onChangeRole}
        />
      ))}
    </div>
  );
};

export default RecipientBox;
