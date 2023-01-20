import { URLBuilder } from "@utils/url";
import axios from "axios";
type AnswerType = "TEXT" | "MULTIPLE_CHOICE" | "ATTACHMENT"


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
  return axios.post(URLBuilder("/services/create"), props, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}
