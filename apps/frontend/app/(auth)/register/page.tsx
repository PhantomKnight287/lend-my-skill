import RegisterForm from "@/components/layout/register";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Register | Lend My Skill",
  description: "Create an account and start freelancing.",
  openGraph: {
    type: "website",
    title: "Register | Lend My Skill",
    description: "Create an account and start freelancing.",
  },
  twitter: {
    title: "Register | Lend My Skill",
    description: "Create an account and start freelancing.",
  },
};

function RegisterPage() {
  return <RegisterForm />;
}

export default RegisterPage;
