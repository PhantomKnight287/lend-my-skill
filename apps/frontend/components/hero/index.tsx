import styles from "./hero.module.scss";
import { Button, Title, useMantineColorScheme } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";
import { outfit, sen } from "@fonts";
import {
  IconArrowRight,
  IconBrandCashapp,
  IconBrandGithub,
  IconPremiumRights,
} from "@tabler/icons-react";
import { useUser } from "@hooks/user";

const Features: Array<{
  title: string;
  description: ReactNode;
  icon?: ReactNode;
}> = [
  {
    title: "Open Source",
    description:
      "We are an open source platform, you can contribute to our codebase.",
    icon: <IconBrandGithub />,
  },
  {
    title: "Ease Of Use",
    description:
      "Our platform is very easy to use, it has all the features needed by a user.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-user-heart"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M6 21v-2a4 4 0 0 1 4 -4h.5"></path>
        <path d="M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296z"></path>
        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
      </svg>
    ),
  },
  {
    title: "Low Comission",
    description:
      "We take very less comission out of your pay. You get almost full amount.",
    icon: <IconPremiumRights size={30} />,
  },
  {
    title: "Multiple Payment Methods",
    description:
      "We support multiple payment methods including UPI and Paytm Wallet.",
    icon: <IconBrandCashapp />,
  },
];

export function Hero(props: { hideDashboardButton?: boolean }) {
  const { colorScheme } = useMantineColorScheme();
  const { username } = useUser();

  return (
    <div
      className={clsx(
        `items-center justify-center flex flex-col`,
        outfit.className,
        styles.gradient
      )}
    >
      <Title
        align="center"
        className={clsx(sen.className, "mt-10 text-7xl", {
          "text-white": colorScheme === "dark",
        })}
      >
        A Platform For
        <br />
        Everyone
      </Title>
      <p
        className={clsx("text-xl mb-8 mt-4 text-center", {
          "text-gray-600": colorScheme === "light",
          "text-gray-400": colorScheme === "dark",
        })}
      >
        Get Your Work Done By Skilled Freelancers.
      </p>
      <div
        className={clsx("flex flex-row justify-center w-full items-center ", {
          hidden: username && !props.hideDashboardButton,
        })}
      >
        <div
          className={clsx(
            "mt-2 mb-4 flex items-center justify-center rounded-md p-[2px] duration-[125ms] transition-all hover:scale-110 w-fit"
          )}
          data-aos="zoom-in"
        >
          {username ? (
            <Link href="/dashboard"
            className="flex flex-row bg-primary p-2 rounded-md px-4 font-medium"
            >
              Take Me to Dashboard <IconArrowRight className="m-0 p-0 ml-2" />
            </Link>
          ) : (
            <Link href="/auth/register"
            className="flex flex-row bg-primary p-2 rounded-md px-4 font-medium"
            >
              Get Started <IconArrowRight className="m-0 p-0 ml-2" />
            </Link>
          )}
        </div>
      </div>

      <div className="container py-16 md:py-28 gap-6 flex flex-row flex-wrap items-center  justify-center shadow-2xl  shadow-[##281335]">
        {Features.map((f) => (
          <Feature icon={null} {...f} key={f.title} />
        ))}
      </div>
    </div>
  );
}

type FeatureProps = {
  title: string;
  description: ReactNode;
  icon: ReactNode;
};

function Feature({ description, title, icon }: FeatureProps) {
  return (
    <div className={clsx("p-4 md:w-1/3 flex bg-white ", styles.glass)}>
      <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-gray-300 text-indigo-400 mb-4 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-grow pl-6">
        <h2 className="text-black text-lg title-font font-medium mb-2">
          {title}
        </h2>
        <p className="leading-relaxed text-base max-w-sm">{description}</p>
      </div>
    </div>
  );
}
