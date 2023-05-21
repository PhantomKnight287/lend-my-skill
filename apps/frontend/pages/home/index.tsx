import { Footer } from "@components/footer";
import { Hero } from "@components/hero";
import { MetaTags } from "@components/meta";
import useHydrateUserContext from "@hooks/hydrate/user";
import type { NextPage } from "next";

const Home: NextPage = () => {
  useHydrateUserContext();
  return (
    <div>
      <MetaTags
        description="An Open Source Freelance Platform For Everyone."
        title="Lend My Skill"
      />
      <Hero />

      <Footer
        links={[
          {
            label: "Terms and Conditions",
            link: "/terms",
          },
          {
            label: "Privacy Policy",
            link: "/privacy",
          },
          {
            label: "About Us",
            link: "/about",
          },
          {
            label: "Contact Us",
            link: "mailto:gurpal@lendmyskill.com?subject=Contact Us&body=Hi, ",
          },
        ]}
      />
    </div>
  );
};
export default Home;
