import { Table, Text } from "@innovaccer/design-system";
import React from "react";
import { useNavigate } from "react-router-dom";
import { pathTo } from "../..";
import { RecipientParser } from "../../../../ds_helpers/recipient_parser";
import { formatDate } from "../../../../utils";
import EnvelopeStatusHint from "../../../../components/EnvelopeStatusHint";

const FormsTable = ({ envelopes, isLoading }) => {
  const navigate = useNavigate();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Table
        type="resource"
        onRowClick={(data) => {
          console.log(data);
          navigate(pathTo.envelopeDetails(data.envelopeId));
        }}
        schema={[
          {
            displayName: "Name",
            name: "emailSubject",
            width: "40%",
          },
          {
            displayName: "Sender",
            name: "envelopeSender",
            width: "20%",
            cellRenderer(props) {
              return (
                <div className="d-flex flex-column">
                  <Text>{props.data.sender.userName}</Text>
                  <Text appearance="subtle" size="small">
                    {props.data.sender.email}
                  </Text>
                  <Text appearance="subtle" size="small">
                    {`Created: ${formatDate(props.data.createdDateTime)}`}
                  </Text>
                </div>
              );
            },
          },
          {
            displayName: "Status",
            name: "status",
            width: "200px",
            cellRenderer: (props) => {
              const status  = props.data.status
              return (
                <div>
                  <EnvelopeStatusHint status={status}>{status}</EnvelopeStatusHint> <br />
                  <Text appearance="subtle" size="small">
                    {props.data?.purgeState}
                  </Text>
                </div>
              );
            },
          },
          {
            displayName: "Recipients",
            name: "recipients",
            width: "20%",
            cellRenderer: (props) => {
              const recipientHelper = new RecipientParser(
                props.data.recipients
              );
              const recipients = recipientHelper.flattenRecipients();
              return (
                <div>
                  {recipients.map((recipient, index) => {
                    return (
                      <div
                        key={index}
                        className="d-flex col-gap-1 align-items-center"
                      >
                        <EnvelopeStatusHint
                          status={recipient.status}
                        >{`${recipient.name} (${recipient.role})`}</EnvelopeStatusHint>
                      </div>
                    );
                  })}
                </div>
              );
            },
          },
        ]}
        data={envelopes}
        loading={isLoading}
      />
    </div>
  );
};
export default FormsTable;
