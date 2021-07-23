import axios from "axios";

const axiosClient = (baseURL: string) =>
  axios.create({
    baseURL,
  });

const api = <P>(baseUrl: string) => ({
  get: <T>(path: string, params?: P) => {
    return axiosClient(baseUrl).get<T>(path, {
      params: {
        ...(params || {}),
        apikey: process.env.NEXT_PUBLIC_MARVEL_API_KEY,
      },
    });
  },
});

export default api;
