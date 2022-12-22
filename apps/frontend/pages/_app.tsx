import { AppProps } from "next/app";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import "../styles/globals.css";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { UserProvider } from "@context/user";
import { Header } from "@components/header";
import { inter } from "@fonts";
import { RouterTransition } from "@components/progress";
import { AnimatePresence, motion } from "framer-motion";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <>
      <RouterTransition />
      <UserProvider>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{ colorScheme, fontFamily: inter.style.fontFamily }}
            withGlobalStyles
            withNormalizeCSS
          >
            <Header />
            <AnimatePresence mode="wait">
              <motion.div
                variants={{
                  exit: {
                    filter: "blur(8px)",
                  },
                  enter: {
                    filter: "blur(0px)",
                  },
                }}
                animate="enter"
                initial="initial"
                // animate="animate"
                exit="exit"
                key={props.router.pathname}
              >
                <Component {...pageProps} key={props.router.asPath} />
              </motion.div>
            </AnimatePresence>
          </MantineProvider>
        </ColorSchemeProvider>
      </UserProvider>
    </>
  );
}
