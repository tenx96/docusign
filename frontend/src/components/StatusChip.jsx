import React from "react";
import { getStatusClass } from "../utils";

const StatusChip = ({ status }) => {
  return <span className={`${getStatusClass(status)} chip`}>{status}</span>;
};

export default StatusChip;
