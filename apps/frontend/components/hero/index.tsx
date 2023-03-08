import styles from "./hero.module.scss";
import { Button, Title, useMantineColorScheme } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import TextTransition from "@components/text";
import { config } from "react-spring";
import clsx from "clsx";
import { outfit, sen } from "@fonts";

const Features = [
  {
    title: "Ease Of Use",
    description:
      "Our platform is very easy to use, it has all the features needed by a user.",
  },
  {
    title: "Low Comission",
    description:
      "We take very less comission out of your pay. You get almost full amount.",
  },
  {
    title: "Multiple Payment Methods",
    description:
      "We support multiple payment methods including UPI and Paytm Wallet.",
  },
];

const Words = [
  "Web Developers 💻",
  "Blog Writers 📝",
  "Video Editors 📹",
  "Everyone.",
];

export function Hero() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((i) => i + 1);
    }, 2000);
    return () => clearTimeout(intervalId);
  }, []);
  const { colorScheme } = useMantineColorScheme();

  return (
    <div
      className={clsx(`items-center justify-center`, {
        [styles.heroContainer]: true,
        [outfit.className]: true,
      })}
    >
      <Title
        align="center"
        className={clsx(sen.className, {
          "text-white": colorScheme === "dark",
        })}
      >
        A Platform For
        <span>
          <TextTransition
            springConfig={config.gentle}
            className={clsx("text-center", sen.className)}
          >
            {
              <span
                className={clsx("text-center", sen.className, {
                  " bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] bg-clip-text text-transparent":
                    Words[index % Words.length].toLowerCase() === "everyone.",
                })}
              >
                {Words[index % Words.length]}
              </span>
            }
          </TextTransition>
        </span>
      </Title>
      <p className="text-xl text-gray-600 mb-8 mt-2" style={{}}>
        Get Your Work Done By Skilled Freelancers
      </p>
      <div className={styles.buttonContainer} data-aos="zoom-in">
        <Link href="/dashboard" passHref>
          <Button
            variant="filled"
            className="bg-black hover:bg-gray-900 duration-[125ms] transition-all hover:scale-110"
            color="dark"
          >
            Discover Dashboard
          </Button>
        </Link>
      </div>
      <div className={styles.featuresContainer}>
        <h2 className={styles.feature}>Features</h2>
        <div className={clsx(styles.featureContainer, "w-full m-0")}>
          <h2 className={styles.featureTitle}>Open Source</h2>
          <p className={styles.featureDescription}>
            {" "}
            Our platform is Open Source. You can read the source code{" "}
            <a
              href="https://github.com/phantomknight287/lend-my-skill"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 cursor-pointer"
            >
              Here.
            </a>
          </p>
        </div>
        {Features.map((f) => (
          <div key={f.title} className={styles.featureContainer}>
            <h2 className={styles.featureTitle}>{f.title}</h2>
            <p className={styles.featureDescription}> {f.description}</p>
          </div>
        ))}
      </div>
      {/* <h1 data-aos="zoom-y-out" data-aos-delay="300" className={styles.work}>
        Your Work is Our <span className={styles.gradientText2}>Work.</span>
      </h1> */}
    </div>
  );
}
