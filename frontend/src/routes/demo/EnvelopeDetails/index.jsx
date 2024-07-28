import { Button, Listbox } from "@innovaccer/design-system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import get from "lodash/get";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  demoApiGetEnvelope,
  updateEnvelope,
} from "../../../api/demo/envelopes";
import SourceModal from "../../../components/SourceModal";
import StatusChip from "../../../components/StatusChip";
import { RecipientParser } from "../../../ds_helpers/recipient_parser";
import EachRecipient from "./atoms/EachRecipient";
import EnvelopeDocumentView from "./atoms/EnvelopeDocumentView";
import RecipientView from "./atoms/RecipientView";
import { pathTo } from "..";
import EnvelopeStatusHint from "../../../components/EnvelopeStatusHint";
const EnvelopeDetails = () => {
  const { envelopeId } = useParams();

  const navigate = useNavigate();

  const [selectedRecipient, setSelectedRecipient] = React.useState(null);

  const envelopeDetailsQuery = useQuery({
    queryKey: ["envelopeDetails", envelopeId],
    queryFn: async () => {
      return demoApiGetEnvelope({
        envelopeId,
        qs: {
          include: "recipients",
        },
      });
    },
  });
  const client = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return updateEnvelope({
        envelopeId,
        data,
      });
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["envelopeDetails", envelopeId],
      });
    },
  });

  if (envelopeDetailsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (envelopeDetailsQuery.isError) {
    return <div>Error Fetching envelope details</div>;
  }

  const recipientsRaw = get(envelopeDetailsQuery, "data.recipients", []);
  const recipientsHelper = new RecipientParser(recipientsRaw);
  const recipients = recipientsHelper.flattenRecipients();
  const envelope = get(envelopeDetailsQuery, "data", {});

  return (
    <div>
      <SourceModal
        title="Envelope Details"
        sourceText={envelopeDetailsQuery.data}
      />
      <div>
        <h2>{envelope.emailSubject}</h2>

        <div className="d-flex align-items-center col-gap-1">
          <EnvelopeStatusHint status={envelope.status}>
            {envelope.status}
          </EnvelopeStatusHint>
          {envelope.status == "created" && (
            <Button
              onClick={() => navigate(pathTo.draftReview(envelope.envelopeId))}
              icon="send"
            >
              Review Draft
            </Button>
          )}
          <Button
            onClick={() => navigate(pathTo.correctView(envelope.envelopeId))}
            icon="send"
          >
            Correct Envelope
          </Button>
        </div>
        <div>
          Sender: {envelope.sender?.email} ({envelope.sender.userName})
        </div>
        <div>
          <h3>Recipients</h3>
          <div>
            <Listbox type="resource">
              {recipients.map((recipient, index) => {
                return (
                  <EachRecipient
                    key={index}
                    recipient={recipient}
                    envelopeId={envelopeId}
                    onSelectRecipient={setSelectedRecipient}
                  />
                );
              })}
            </Listbox>

            <div className="d-flex align-items-center col-gap-1">
              <Button
                loading={updateMutation.isPending}
                onClick={() => {
                  updateMutation.mutate({
                    status: "voided",
                    voidedReason: "voided by user",
                  });
                }}
                icon="stop"
              >
                Void
              </Button>
              <Button onClick={() => setSelectedRecipient(null)}>Clear</Button>
            </div>
          </div>
        </div>

        {selectedRecipient ? (
          <RecipientView
            envelopeId={envelopeId}
            recipient={selectedRecipient}
          />
        ) : (
          <EnvelopeDocumentView envelopeId={envelopeId} />
        )}
      </div>
    </div>
  );
};

export default EnvelopeDetails;
