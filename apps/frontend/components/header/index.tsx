import { outfit } from "@fonts";
import { useUser } from "@hooks/user";
import {
  createStyles,
  Header as H,
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import HeaderMenu from "./menu";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: -theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md * 2}px`,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();
  const { username, userType } = useUser();
  const { asPath } = useRouter();
  return (
    <H height={70} className="bg-[unset] border-0">
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
              href="/login"
              className={clsx("p-5 font-medium hover:underline")}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={clsx("p-5 font-medium hover:underline")}
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </H>
  );
}
