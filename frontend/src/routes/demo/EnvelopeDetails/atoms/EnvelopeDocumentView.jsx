import React, { useEffect } from "react";
import DemoApiClient from "../../../../api/demo/DemoApiClient";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "../../../../hooks/useDisclosure";

const EnvelopeDocumentView = ({ envelopeId }) => {
  const [loading, setLoading] = React.useState(true);
  const [dataUrl, setDataUrl] = React.useState();

  useEffect(() => {
    setDataUrl("");
    setLoading(true);
    DemoApiClient.get(`/envelopes/${envelopeId}/documents/combined`, {responseType: "blob"}).then(
      (res) => {
        console.log(res);
        // handle file response
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        setDataUrl(fileURL);
        setLoading(false);
      }
    );
  }, [envelopeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {dataUrl && <iframe src={dataUrl} width="100%" height="1000px" />}
    </div>
  );
};

export default EnvelopeDocumentView;
