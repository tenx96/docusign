import {
  Button,
  Input,
  Label,
  Select,
  Textarea,
} from "@innovaccer/design-system";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { demoApigetTemplateRecipients } from "../../../../api/demo/templates";
import Loader from "../../../../components/Loader";
import { RecipientParser } from "../../../../ds_helpers/recipient_parser";
import { extractFormEventData } from "../../../../utils";
import { nanoid } from "nanoid";
import { CreateEnvelopeQueryBuilder } from "../../../../api/demo/ApiQueryBuilder/createEnvelope";
import { RecipientsQueryBuilder } from "../../../../api/demo/ApiQueryBuilder/recipientsBuilder";
import { demoApiCreateEnvelope } from "../../../../api/demo/envelopes";
import { useNavigate } from "react-router-dom";
import { pathTo } from "../..";
const RecipientSelection = ({ template }) => {
  const [selectedRecipients, setSelectedRecipients] = React.useState([]);
  const navigate = useNavigate();
  const recipientsQuery = useQuery({
    queryKey: ["recipients"],
    queryFn: () =>
      demoApigetTemplateRecipients({ templateId: template.templateId }),
  });

  const createEnvelopeMutation = useMutation({
    mutationFn: demoApiCreateEnvelope,
    onSuccess: ({ envelopeId }) => {
      navigate(pathTo.envelopeDetails(envelopeId));
    },
  });

  if (recipientsQuery.isLoading) {
    return <Loader />;
  }

  if (recipientsQuery.isError) {
    return <div>Error fetching recipients</div>;
  }

  const recipientsHelper = new RecipientParser(recipientsQuery.data || []);
  const recipients = recipientsHelper.flattenRecipients();

  return (
    <div>
      <h1>Create Envelope</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = extractFormEventData(e);
          const clientUserId = nanoid();
          const recipient  = recipientsHelper.roleToBlockMap[formData.recipientRole];
          setSelectedRecipients([
            ...selectedRecipients,
            {
              ...formData,
              clientUserId,
              recipientId: recipient["recipientId"],
              block: recipient["block"],
            },
          ]);
        }}
      >
        <Label>Recipient Name</Label>
        <Input type="text" name="name" />
        <Label>Recipient Email</Label>
        <Input type="email" name="email" />
        <Label>Recipient Role</Label>
        <div>
          <select defaultValue="" name="recipientRole">
            <option value="" disabled>
              Select an option
            </option>
            {recipients.map((recipient) => (
              <option value={recipient.role}>{recipient.role}</option>
            ))}
          </select>
        </div>
        <Button>Add Recipient</Button>
      </form>

      <h4>Recipients</h4>
      <div>
        {selectedRecipients.map((recipient) => {
          return (
            <div key={recipient.id}>
              <ol>
                {Object.keys(recipient).map((key) => (
                  <li>
                    {key}: {recipient[key]}
                  </li>
                ))}
              </ol>
              <Button
                onClick={() => {
                  setSelectedRecipients(
                    selectedRecipients.filter(
                      (r) => r["clientUserId"] !== recipient["clientUserId"]
                    )
                  );
                }}
              >
                X
              </Button>
            </div>
          );
        })}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = extractFormEventData(e);

            let isDraft = false
            if(formData.draft == "on") {
              isDraft = true
            }
            const recipients = new RecipientsQueryBuilder({
              recipients: selectedRecipients,
            }).getPayload();

            const createPayload = new CreateEnvelopeQueryBuilder({
              recipients,
              templateId: template.templateId,
              status: isDraft ? "created" : "sent",
            }).getPayload();

            createEnvelopeMutation.mutate({ data: createPayload });
          }}
        >
          <label htmlFor="">Create draft envelope</label><input type="checkbox" name="draft" />
          <Button
            loading={createEnvelopeMutation.isPending}
            appearance="primary"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RecipientSelection;
