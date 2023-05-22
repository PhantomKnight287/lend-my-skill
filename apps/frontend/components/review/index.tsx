/* eslint-disable react/no-children-prop */
import { Renderer } from "@components/renderer";
import { sen } from "@fonts";
import { Avatar, Rating } from "@mantine/core";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder } from "@utils/url";
import clsx from "clsx";
import Link from "next/link";
import { Service } from "~/types/service";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function Review(prop: Service["review"][0]) {
  const { createdAt, id, ratedBy, rating, review } = prop;
  return (
    <div className="flex flex-col border-[1px] border-gray-200 rounded-md p-3">
      <div className="flex flex-row items-center">
        <Avatar
          src={
            ratedBy.avatarUrl
              ? assetURLBuilder(ratedBy.avatarUrl)
              : profileImageRouteGenerator(ratedBy.username)
          }
          alt={ratedBy.username}
          radius="xl"
        />
        <Link
          href={`/@${ratedBy.username}`}
          className="font-bold text-lg ml-2 pr-2 border-r-[3px] border-gray-300"
        >
          {ratedBy.name}
        </Link>
        <Rating fractions={2} value={rating} readOnly />
        <span
          className={clsx("font-bold ml-2", {
            "text-yellow-500": rating > 0,
          })}
        >
          {rating}
        </span>
      </div>
      <article className={"ml-12"}>
        <Renderer children={review} removeComponents classes={sen.className} />
        <span className="text-gray-500 text-sm">
          {dayjs(createdAt).fromNow()}
        </span>
      </article>
    </div>
  );
}
