import axios from "axios";

const DemoApiClient = axios.create({
  baseURL: "http://localhost:8000/demo",
  timeout: 20000,
});

export const handleExternalApi = async (fn) => {
  try {
    const response = await fn;
    return response.data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export default DemoApiClient;