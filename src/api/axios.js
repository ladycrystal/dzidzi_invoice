import axios from "axios";

const API = axios.create({
  baseURL: "https://invoiceapp-8ub4.onrender.com/api/v1",
});

export default API;
