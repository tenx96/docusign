import moment from "moment";

export const formatDate = (date) => {
  return moment(date).format("YYYY-MM-DD hh:mm a");
};

export const getStatusClass = (status) => {
  switch (status) {
    case "completed":
      return "chip__success";
    case "sent":
      return "chip__progress";
    case "delivered":
      return "chip__success";
    case "created":
      return "chip__progress";
    case "voided":
      return "chip__default";
    default:
      return "chip__default";
  }
};

export const getEmbedRedirectUtl = ({ envelopeId }) => {
  return `http://localhost:5173/envelopes/${envelopeId}`;
};

export const extractFormEventData = (e) => {
  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return data;
};
