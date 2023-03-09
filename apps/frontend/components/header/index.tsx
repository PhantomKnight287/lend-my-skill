import { useUser } from "@hooks/user";
import { Avatar } from "@mantine/core";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import HeaderMenu from "./menu";

export function Header() {
  const { username } = useUser();
  const { asPath } = useRouter();
  return (
    <div className="h-[70px] border-0 ">
      <div className="container md:mx-auto mx-[unset]">
        <div className="pt-2 w-full flex justify-around items-center">
          <div
            className={clsx({
              "min-w-[175px]": !username,
            })}
          >
            <Avatar size={60} src="/brand/lms-logo.png" />
          </div>
          <div
            className={clsx("flex-row mx-auto items-center px-5", {
              hidden: username,
              "md:flex": !username,
            })}
          >
            <Link
              href="/"
              className={clsx("p-5 font-medium hover:underline", {
                underline: asPath === "/",
              })}
            >
              Overview
            </Link>
            <Link
              href="/privacy"
              className={clsx("p-5 font-medium hover:underline", {
                underline: asPath === "/privacy",
              })}
            >
              Privacy Policy
            </Link>
            <Link
              href="mailto:staff@lendmyskill.com"
              className={clsx("p-5 font-medium hover:underline")}
            >
              Contact
            </Link>
          </div>
          <div className="flex flex-row items-center justify-center">
            <Link
              href="/auth/login"
              className={clsx("p-5 font-medium hover:underline")}
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className={clsx("p-5 font-medium hover:underline")}
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
