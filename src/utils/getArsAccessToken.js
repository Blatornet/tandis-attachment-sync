import axios from "./axios.js";

const { ARS_API_USER, ARS_API_PASS } = process.env;

const getArsAccessToken = async () => {
  console.log("### get accesstoken");
  try {
    if (!ARS_API_USER || !ARS_API_PASS) {
      throw new Error("Missing ARS_API_USER or ARS_API_PASS environment variables");
    }

    const loginData = new URLSearchParams();
    loginData.append("username", ARS_API_USER);
    loginData.append("password", ARS_API_PASS);

    const loginResponse = await axios.post("/api/jwt/login", loginData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

    });

    const token = loginResponse.data;

    if (!token) {
      throw new Error("No Access token generated");
    }

    return token;
  } catch (error) {
    console.log("### get accesstoken error", error);
  }
}

export default getArsAccessToken;