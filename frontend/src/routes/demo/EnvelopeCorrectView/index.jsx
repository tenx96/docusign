import React from 'react'
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { demoApiCorrectView } from "../../../api/demo/views";

const EnvelopeCorrectView = () => {
  const { envelopeId } = useParams();

  const query = useQuery({
    queryKey: ["correctEdit", envelopeId],
    queryFn: async () => {
      return demoApiCorrectView({
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
    return <div>Error fetching correct view</div>;
  }

  const url = query.data?.url;

  return (
    <div>
      <h4>Correct View</h4>
      <iframe src={url} width="100%" height="1000px" />
    </div>
  );
};

export default EnvelopeCorrectView;
