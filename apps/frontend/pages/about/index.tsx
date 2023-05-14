import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import { Image, SimpleGrid } from "@mantine/core";
import clsx from "clsx";

const AboutPage = () => {
  return (
    <>
      <MetaTags
        title="About Us"
        description="Learn more about our company and our commitment to providing top-notch services. Meet our talented team and find out what drives us to succeed every day."
      />
      <Container>
        <h1
          className={clsx("font-bold text-3xl text-center", {
            [outfit.className]: true,
          })}
        >
          Our Mission
        </h1>
        <h2
          className={clsx("text-xl  mt-10 text-center", {
            [outfit.className]: true,
          })}
        >
          Our mission is to bring more people from India into freelance market,
          make the best platform for freelancers who provide the best services
          and solutions to their customers. We believe people should not
          necessarily need to pay to big agencies abroad or in high prices, when
          the talented developers are already here in India. Our mission is to
          connect the best developers and designers to respective customers.
        </h2>
        <h1
          className={clsx("font-bold text-3xl text-center mt-10", {
            [outfit.className]: true,
          })}
        >
          Our Team
        </h1>
        <SimpleGrid
          cols={2}
          breakpoints={[
            {
              maxWidth: "sm",
              cols: 1,
            },
          ]}
        >
          <div className="flex flex-col items-center ">
            <Image
              src={"/team/paras.jpeg"}
              alt="Paras Jain"
              classNames={{
                image: "rounded-md",
              }}
              width={200}
              height={200}
            />
            <div className="flex flex-col items-center flex-1">
              <a
                href="https://www.instagram.com/paras_3048/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Paras Jain"
                className="underline"
              >
                <h1
                  className={clsx("font-bold text-2xl text-center mt-10", {
                    [outfit.className]: true,
                  })}
                >
                  Paras Jain
                </h1>
              </a>
              <h2
                className={clsx("text-base text-center", {
                  [outfit.className]: true,
                })}
              >
                Founder, CEO
              </h2>
            </div>
          </div>
          <div className="flex flex-col items-center ">
            <Image
              src={"https://avatars.githubusercontent.com/u/76196237?v=4"}
              alt="Gurpal Singh"
              classNames={{
                image: "rounded-md",
              }}
              width={200}
              height={200}
            />
            <div className="flex flex-col items-center flex-1">
              <a
                href="https://github.com/phantomknight287"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Gurpal Singh"
                className="underline"
              >
                <h1
                  className={clsx("font-bold text-2xl text-center mt-10", {
                    [outfit.className]: true,
                  })}
                >
                  Gurpal Singh
                </h1>
              </a>
              <h2
                className={clsx("text-base text-center", {
                  [outfit.className]: true,
                })}
              >
                CTO
              </h2>
            </div>
          </div>
        </SimpleGrid>
      </Container>
    </>
  );
};

export default AboutPage;
