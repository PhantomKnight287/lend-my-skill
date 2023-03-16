import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Lend My Skill</span>,
  project: {
    link: "https://github.com/PhantomKnight287/lend-my-skill",
  },
  docsRepositoryBase:
    "https://github.com/PhantomKnight287/lend-my-skill/tree/backend-refactor/apps/docs",
  footer: {
    text: "Lend My Skill",
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Lend My Skill",
    };
  },
};

export default config;
