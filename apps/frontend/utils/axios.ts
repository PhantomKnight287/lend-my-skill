import a from "axios";

export const axios = a.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
