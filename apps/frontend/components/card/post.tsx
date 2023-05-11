import { sanitize } from "@components/tabs/profile/services";
import { outfit } from "@fonts";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
} from "@mantine/core";
import { assetURLBuilder } from "@utils/url";
import clsx from "clsx";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import { Posts } from "~/types/jobpost";

interface Props {
  title: string;
  description: string;
  images: string[];
  price?: number;
  buttonTitle?: string;
  author?: Posts["posts"][0]["author"];
  slug: string;
  type: "service" | "job";
  resolveImageUrl: boolean;
  badgeLabel?: string;
}

export function PostCard({
  description,
  images,
  slug,
  title,
  type,
  buttonTitle,
  resolveImageUrl = true,
  badgeLabel,
}: Props) {
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      className={"max-w-[350px]  min-w-[300px] h-full min-h-[21rem] mx-1"}
    >
      <Card.Section>
        <Carousel>
          {images.map((image, index) => (
            <Image
              key={index}
              src={resolveImageUrl ? assetURLBuilder(image) : image}
              alt={title}
              height={300}
              className="object-cover"
            />
          ))}
        </Carousel>
      </Card.Section>

      <Group
        position="apart"
        mt="md"
        mb="xs"
        className="flex flex-col items-start justify-center"
      >
        <Text weight={500} lineClamp={1}>
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

      <Link href={`/${type}/${slug}`} target="_blank" rel="noopener noreferrer">
        <Button
          fullWidth
          mt="md"
          radius="md"
          className={clsx(
            "transition-all duration-[110ms] hover:scale-105 hover:bg-purple-700 bg-purple-500",
            {
              [outfit.className]: true,
            }
          )}
        >
          {buttonTitle || "View Details"}
        </Button>
      </Link>
    </Card>
  );
}
