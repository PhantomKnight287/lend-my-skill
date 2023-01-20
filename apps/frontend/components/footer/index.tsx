import { outfit } from "@fonts";
import { createStyles, Container, Group, Anchor, Avatar } from "@mantine/core";
import clsx from "clsx";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
  link:{
    ":hover":{
      textDecoration: "underline",
    }
  }
}));

interface FooterSimpleProps {
  links: { link: string; label: string }[];
}

export function Footer({ links }: FooterSimpleProps) {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Link
      color="dimmed"
      key={link.label}
      href={link.link}
      className={classes.link}
      target={link.link.startsWith("mailto:") ? "_self" : "_blank"}
      rel={link.link.startsWith("mailto:") ? undefined : "noopener noreferrer"}
    >
      {link.label}
    </Link>
  ));

  return (
    <div
      className={clsx({
        [outfit.className]: true,
        [classes.footer]: true,
      })}
    >
      <Container className={classes.inner}>
        <div className="flex flex-row gap-3 items-center justify-center flex-wrap">
          <Avatar src={"/brand/lms-logo.png"} size={50} />
          <h1 className={clsx("text-lg",{
            [outfit.className]: true,
          })}>Lend My Skill</h1>
        </div>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
