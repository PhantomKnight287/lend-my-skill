import { outfit } from "@fonts";
import { useUser } from "@hooks/user";
import {
  createStyles,
  Header as H,
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
} from "@tabler/icons";
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
    <Box>
      <H
        height={60}
        px="md"
        className="flex flex-row items-center justify-around"
      >
        <Link
          href={username ? "/dashboard" : "/"}
          className={clsx({
            "min-w-[183px]": !username,
          })}
        >
          <Avatar size={50} src={"/brand/lms-logo.png"} />
        </Link>

        <Group
          style={{ height: "100%" }}
          className={clsx(classes.hiddenMobile)}
        >
          {userType !== "freelancer" ? (
            <Link href="/search?type=services">
              <Button
                variant="default"
                className={clsx("", {
                  [outfit.className]: true,
                })}
              >
                Hire a Talent
              </Button>
            </Link>
          ) : null}
          {userType !== "client" ? (
            <Link href="/search?type=jobposts">
              <Button
                variant="default"
                className={clsx("", {
                  [outfit.className]: true,
                })}
              >
                Find a Job
              </Button>
            </Link>
          ) : null}
        </Group>
        <Group
          className={clsx("", {
            [classes.hiddenMobile]: true,
          })}
          // align="center"
        >
          {!username ? (
            <>
              <Link
                href={{
                  pathname: "/auth/login",
                  query: { to: asPath },
                }}
              >
                <Button
                  variant="default"
                  className={clsx("", {
                    [outfit.className]: true,
                  })}
                >
                  Log in
                </Button>
              </Link>
              <Link
                href={{
                  pathname: "/auth/register",
                  query: { to: asPath },
                }}
              >
                <Button
                  variant="outline"
                  className={clsx("", {
                    [outfit.className]: true,
                  })}
                >
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <HeaderMenu />
          )}

          {!username ? (
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
            />
          ) : (
            <div className={classes.hiddenDesktop}>
              <HeaderMenu />
            </div>
          )}
        </Group>
      </H>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Lend My Skill"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Link href="/" className={classes.link}>
            Home
          </Link>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Group position="center" grow pb="xl" px="md">
            <Link
              href={{
                pathname: "/auth/login",
                query: { to: asPath },
              }}
            >
              <Button fullWidth variant="default">
                Log in
              </Button>
            </Link>
            <Link
              href={{
                pathname: "/auth/register",
                query: { to: asPath },
              }}
            >
              <Button fullWidth variant="default">
                Register
              </Button>
            </Link>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
