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
            <Link href={username ? "/dashboard" : "/"}>
              <Avatar size={60} src="/brand/lms-logo.png" />
            </Link>
          </div>
          <div
            className={clsx("flex-row mx-auto items-center px-5 hidden", {
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
          <div
            className={clsx("flex flex-row items-center justify-center", {
              hidden: username,
            })}
          >
            <Link
              href="/auth/login"
              className={clsx("p-5 font-medium hover:underline")}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className={clsx(
                "p-3 font-medium rounded-3xl py-2 text-black bg-primary  px-4  "
              )}
            >
              Signup
            </Link>
          </div>
          <div
            className={clsx({
              hidden: !username,
            })}
          >
            <HeaderMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
