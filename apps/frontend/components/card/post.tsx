/* eslint-disable react/no-children-prop */
import { Renderer } from "@components/renderer";
import { sanitize } from "@components/tabs/profile/services";
import { outfit } from "@fonts";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
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
        <Carousel showThumbs={false}>
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
        mb="xs"
        className="flex flex-col items-start justify-center"
      >
        <Text weight={500} lineClamp={1} mt={"md"}>
          {title}
        </Text>
        {badgeLabel ? <Badge variant="light">{badgeLabel}</Badge> : null}
      </Group>

      {/* <Text size="sm" color="dimmed" lineClamp={2}>
        <Renderer children={description} removeComponents />
      </Text> */}

      <Link href={`/${type}/${slug}`} target="_blank" rel="noopener noreferrer">
        <Button
          fullWidth
          mt="md"
          radius="md"
          className={clsx(
            "transition-all duration-[110ms] hover:scale-105 bg-primary hover:bg-primary/90",
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
