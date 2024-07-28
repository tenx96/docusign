import { StatusHint, Tooltip } from "@innovaccer/design-system";
import React from "react";

// avalable status 'default' | 'alert' | 'info' | 'success' | 'warning';
export const getStatusClass = (status) => {
  switch (status) {
    case "completed":
      return "success";
    case "sent":
      return "info";
    case "delivered":
      return "default";
    case "voided":
      return "warning";
    default:
      return "default";
  }
};

const EnvelopeStatusHint = ({ status, children }) => {
  return (
    <Tooltip tooltip={`Status: ${status}`}>
      <StatusHint appearance={getStatusClass(status)}>{children}</StatusHint>
    </Tooltip>
  );
};

export default EnvelopeStatusHint;
