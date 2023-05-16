import { FC, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { SpecialComponents } from "react-markdown/lib/ast-to-react";
import { NormalComponents } from "react-markdown/lib/complex-types";
import remarkGfm from "remark-gfm";
import styles from "./renderer.module.scss";
import { useMantineColorScheme } from "@mantine/core";
import rehypeRaw from "rehype-raw";
import remarkImages from "remark-images";
import clsx from "clsx";
import remarkGemoji from "remark-gemoji";

export const Renderer: FC<{
  children: string;
  classes?: string;
  removeComponents?: boolean;
}> = ({ children, classes, removeComponents }) => {
  const { colorScheme } = useMantineColorScheme();
  const components:
    | Partial<
        Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
      >
    | undefined = useMemo(() => {
    return {
      h1: ({ node, children, ...props }) => (
        <h1
          className={styles.h1}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
        >
          {children}
        </h1>
      ),
      h2: ({ node, children, ...props }) => (
        <h2
          {...props}
          className={styles.h2}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
        >
          {children}
        </h2>
      ),
      h3: ({ node, children, ...props }) => (
        <h3
          {...props}
          className={styles.h3}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
        >
          {children}
        </h3>
      ),
      h4: ({ node, ...props }) => (
        <h4
          {...props}
          className={styles.h4}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
        />
      ),
      h5: ({ node, ...props }) => (
        <h5
          {...props}
          className={styles.h5}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
        />
      ),
      h6: ({ node, ...props }) => (
        <h6
          {...props}
          className={styles.h6}
          style={{
            ...props.style,
            color: colorScheme === "dark" ? "#ffffff" : "unset",
          }}
        />
      ),
      ul: ({ node, ...props }) => (
        <ul {...props} className={"list-disc ml-4"} />
      ),
      ol: ({ node, ...props }) => (
        <ol {...props} className={"list-decimal ml-4"} />
      ),
    };
  }, []);
  return (
    <div
      className={clsx("", {
        "text-[#eaeaea]": colorScheme === "dark",
      })}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkImages, remarkGemoji]}
        components={removeComponents ? undefined : components}
        skipHtml={false}
        rehypePlugins={[rehypeRaw]}
        className={clsx(styles.renderer, classes)}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
