import axios from "axios";

const AxiosClient = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 20000,
});

export default AxiosClient;
