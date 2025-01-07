import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.takeit.ciph3r.co/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
