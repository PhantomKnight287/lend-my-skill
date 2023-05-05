import a from "axios";

export const axios = a.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1",
});
