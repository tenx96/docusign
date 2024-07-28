import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { demoApiSenderView } from "../../../api/demo/views";

const DraftReview = () => {
  const { envelopeId } = useParams();

  const query = useQuery({
    queryKey: ["draftReview", envelopeId],
    queryFn: async () => {
      return demoApiSenderView({
        envelopeId,
        data: {
          returnUrl: `http://localhost:5137/envelopes/${envelopeId}`,
          viewAccess: "envelope",
        },
      });
    },
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error fetching draft review</div>;
  }

  const url = query.data?.url;

  return (
    <div>
      <h4>Draft Review</h4>
      <iframe src={url} width="100%" height="1000px" />
    </div>
  );
};

export default DraftReview;
