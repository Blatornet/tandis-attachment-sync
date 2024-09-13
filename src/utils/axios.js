import https from "https";
import axios from "axios";

const { ARS_API_URL } = process.env;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

axios.defaults.baseURL = ARS_API_URL;
axios.defaults.httpsAgent = httpsAgent;

export default axios;