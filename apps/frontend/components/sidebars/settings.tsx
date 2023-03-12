import { useState } from "react";
import { Navbar, createStyles } from "@mantine/core";
import { IconFingerprint, IconUsers } from "@tabler/icons";
import { useRouter } from "next/router";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");

  return {
    navbar: {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    },

    title: {
      textTransform: "uppercase",
      letterSpacing: -0.25,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,
      cursor: "pointer",
      marginTop: "10px",
      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: "light",
            color: theme.primaryColor,
          }).color,
        },
      },
    },

    footer: {
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
      paddingTop: theme.spacing.md,
    },
  };
});

const links = [
  {
    id: 1,
    title: "Account",
    icon: IconUsers,
  },
  {
    id: 2,
    title: "Complete Profile",
    icon: IconFingerprint,
  },
];

export function SettingsSidebar({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("");
  const { push } = useRouter();
  return (
    <Navbar height={840} width={{ sm: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section grow mt="xl">
        {links.map((link) => {
          return (
            <p
              className={cx(classes.link, {
                [classes.linkActive]: link.title.toLowerCase() === active,
              })}
              onClick={() => {
                setActive(link.title.toLowerCase());
                setActiveTab(link.title.toLowerCase());
                push(
                  `/settings?activeTab=${link.title
                    .toLowerCase()
                    .replace(" ", "-")}`
                );
              }}
              key={link.id}
            >
              <link.icon className={classes.linkIcon} stroke={1.5} />
              {link.title}
            </p>
          );
        })}
      </Navbar.Section>
    </Navbar>
  );
}
