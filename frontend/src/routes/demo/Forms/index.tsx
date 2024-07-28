import React from "react";
import FormsTable from "./atoms/FormsTable.jsx";
import FormsHeader from "./atoms/FormsHeader";
import { useQuery } from "@tanstack/react-query";
import { demoApiGetEnvelopes } from "../../../api/demo/envelopes";
import SourceModal from "../../../components/SourceModal";

const Forms = () => {
  const envelopesQuery = useQuery({
    queryKey: ["envelopes"],
    queryFn: async () =>
      demoApiGetEnvelopes({
        qs: {
          from_date: "2020-01-01",
          "include": "recipients",
          "order_by" : "created",
          "order": "desc",
        },
      }),
  });

  const envelopes = envelopesQuery.data?.envelopes || [];

  return (
    <div>
      <FormsHeader /> <SourceModal title="Envelopes Query" sourceText={envelopesQuery.data} />
      <FormsTable envelopes={envelopes} isLoading={envelopesQuery.isLoading} />
    </div>
  );
};

export default Forms;
