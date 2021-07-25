import axios from "axios";
import crypto from "crypto";

const axiosClient = (baseURL: string) =>
  axios.create({
    baseURL,
  });

const ts = Date.now();
const secret = process.env.MARVEL_SECRET_KEY;
const apikey = process.env.NEXT_PUBLIC_MARVEL_API_KEY;

const hash = secret
  ? crypto.createHash("md5").update(`${ts}${secret}${apikey}`).digest("hex")
  : undefined;

const api = <P>(baseUrl: string) => ({
  get: <T>(path: string, params?: P) => {
    return axiosClient(baseUrl).get<T>(path, {
      params: {
        ...(params || {}),
        apikey,
        ts,
        hash,
      },
    });
  },
});

export default api;
