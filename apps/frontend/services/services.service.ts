import { URLBuilder } from "@utils/url";
import axios from "axios";
import { AnswerType } from "db";

interface Props {
  title: string;
  description: string;
  category: string;
  tags: string[];
  bannerImage: string;
  images?: string[];
  packages: {
    name: string;
    description: string;
    price: number;
    deliveryDays: number;
  }[];
  features: { name: string; includedIn: string[] }[];
  questions: { question: NamedCurve; required: boolean; type: AnswerType }[];
}

export async function createService(props: Props, token: string) {
  return axios.post(URLBuilder("/gigs/create"), props, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}
