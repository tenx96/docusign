import { Button, Listbox, Text} from "@innovaccer/design-system";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import StatusChip from "../../../../components/StatusChip";
import { demoApiDeleteEnvelopeRecipient } from "../../../../api/demo/envelopes";

const EachRecipient = ({ recipient, envelopeId, onSelectRecipient }) => {
  const deleteMutation = useMutation({
    mutationFn: async (recipientId) => {
      return demoApiDeleteEnvelopeRecipient({
        envelopeId,
        recipientId,
      });
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["envelopeDetails", envelopeId],
      });
    },
  });
  return (
    <Listbox.Item>
   
      <div className="d-flex align-items-center col-gap-1">
      
        <Text>{recipient.email} ({recipient.recipientType}) role: {recipient.role}</Text>
        <StatusChip status={recipient.status} />

        <Button icon="visibility" onClick={() => onSelectRecipient(recipient)} size="tiny">
          View as recipient
        </Button>
        <Button
          loading={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate(recipient.recipientId)}
          appearance="transparent"
          icon="delete"
        ></Button>
      </div>
    </Listbox.Item>
  );
};

export default EachRecipient;
