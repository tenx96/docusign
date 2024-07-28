import { useQuery } from "@tanstack/react-query";
import React from "react";
import { demoApicreateRecipientView } from "../../../../api/demo/views";

const RecipientView = ({ recipient, envelopeId }) => {

  const recipientViewQuery = useQuery({
    queryKey: ["recipientView", recipient.clientUserId],
    queryFn: () =>
      demoApicreateRecipientView({
        envelopeId,
        data: {
          authenticationMethod: "email",
          returnUrl: `http://localhost:5137/envelopes/${envelopeId}`,
          clientUserId: recipient.clientUserId,
          email: recipient.email,
          userName: recipient.name,
        },
      }),
  });

  if (recipientViewQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (recipientViewQuery.isError) {
    return <div>Error fetching recipient view</div>;
  }

  const recipientViewUrl = recipientViewQuery.data?.url;

  return (
    <div>
      RecipientView
      <iframe src={recipientViewUrl} width="100%" height="1000px" />
    </div>
  );
};

export default RecipientView;
