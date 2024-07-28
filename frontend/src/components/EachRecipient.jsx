import React from "react";
import StatusChip from "./StatusChip";
import { Link } from "react-router-dom";
import { Button } from "@innovaccer/design-system";
import { useMutation } from "@tanstack/react-query";
import { deleteEnvelopeRecipient } from "../api/envelopes";

const EachRecipient = ({
  recipient,
  envelopeId,
  onDeleteSuccess,
  roles,
  onChangeRole,
}) => {
  const deleteRecipientMutation = useMutation({
    mutationFn: deleteEnvelopeRecipient,
  });

  const {
    user_id,
    status,
    signed_date_time,
    sent_date_time,
    name,
    email,
    recipient_id,
    client_user_id,
    role_name
  } = recipient;

  const recipientTabs = `/envelopes/${envelopeId}/recipients/${recipient_id}/tabs`;
  const embeddedSigning = `/envelopes/${envelopeId}/embed-signing?email=${email}&recipientId=${recipient_id}&clientUserId=${client_user_id}&name=${name}`;

  const handleDeleteRecipient = () => {
    deleteRecipientMutation.mutate(
      {
        envelopeId,
        recipientId: recipient_id,
      },
      {
        onSuccess: () => {
          alert("Envelope Recipient deleted successfully");
          onDeleteSuccess();
        },
      }
    );
  };

  return (
    <div key={recipient_id} className="box">
      <ol>
        <li>User Id: {user_id}</li>
        <li>Recipient ID: {recipient_id} </li>
        <li>Client User ID: {client_user_id} </li>
        <li>Recipient Role: {role_name} </li>
        <li>
          Status: <StatusChip status={status} />
        </li>
        <li>Signed Date Time: {signed_date_time}</li>
        <li>Sent Date Time: {sent_date_time}</li>
        <li>Name: {name}</li>
        <li>Email: {email}</li>
        <li>
          <Link to={recipientTabs}>view tabs</Link>
        </li>
        <li>
          <Link to={embeddedSigning}>embedded signing</Link>
        </li>
      </ol>
      <Button
        appearance="alert"
        loading={deleteRecipientMutation.isPending}
        onClick={handleDeleteRecipient}
        icon="delete"
      />
      <form
        action=""
        onSubmit={(e) => {
          // handle update role
          e.preventDefault();
          const form = e.target;
          const newRole = form.newRole.value;
          console.log(newRole);
        }}
      >
        <select
          name="newRole"
          defaultValue={""}
          onChange={(e) => {
            const form = e.target;
            const newRole = form.value;
            onChangeRole?.({
              recipient,
              updatedRole: newRole,
            });
          }}
        >
          <option disabled value={""}>
            Select an option
          </option>
          {roles.map((role, index) => (
            <option key={index} value={role}>
              {role}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default EachRecipient;
