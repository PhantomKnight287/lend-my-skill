import { sanitize } from "@components/tabs/profile/gigs";
import { outfit } from "@fonts";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  useMantineColorScheme,
} from "@mantine/core";
import { assetURLBuilder } from "@utils/url";
import clsx from "clsx";
import Link from "next/link";
import { Posts } from "~/types/jobpost";

interface Props {
  title: string;
  description: string;
  image: string;
  price?: number;
  buttonTitle?: string;
  author: Posts["posts"][0]["author"];
  slug: string;
  type: "gig" | "post";
  resolveImageUrl: boolean;
  badgeLabel?: string;
}

export function PostCard({
  author,
  description,
  image,
  slug,
  title,
  type,
  buttonTitle,
  resolveImageUrl = true,
  badgeLabel,
}: Props) {
  const { colorScheme } = useMantineColorScheme();
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder className={"max-w-[350px]"}>
      <Card.Section>
        <Image
          src={resolveImageUrl ? assetURLBuilder(image) : image}
          height={160}
          alt="Banner Image"
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500} lineClamp={2}>
          {title}
        </Text>
        {badgeLabel ? <Badge variant="light">{badgeLabel}</Badge> : null}
      </Group>

      <Text
        size="sm"
        color="dimmed"
        lineClamp={2}
        dangerouslySetInnerHTML={sanitize(description, undefined)}
      />

      <Link
        href={`/profile/${author?.username}/${type}/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          fullWidth
          mt="md"
          radius="md"
          className={clsx("transition-all duration-[110ms] hover:scale-105", {
            [outfit.className]: true,
            "bg-gray-900 hover:bg-black": colorScheme === "light",
            "bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] text-white":
              colorScheme === "dark",
          })}
        >
          {buttonTitle || "View Details"}
        </Button>
      </Link>
    </Card>
  );
}
