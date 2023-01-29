import { AppProps } from "next/app";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import "@styles/globals.scss";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { UserProvider } from "@context/user";
import { Header } from "@components/header";
import { inter } from "@fonts";
import { RouterTransition } from "@components/progress";
import { AnimatePresence, motion } from "framer-motion";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-phone-input-2/lib/style.css";
import { ModalsProvider } from "@mantine/modals";

const client = new QueryClient();

export default function App(props: AppProps) {
  const { Component, session, pageProps } = props as any;

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  // useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <>
      <QueryClientProvider client={client}>
        <RouterTransition />
        <UserProvider>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              theme={{
                colorScheme,
                fontFamily: inter.style.fontFamily,
                colors: {
                  brand: [
                    "#e3f2fd",
                    "#bbdefb",
                    "#90caf9",
                    "#64b5f6",
                    "#42a5f5",
                    "#2196f3",
                    "#1e88e5",
                    "#1976d2",
                    "#1565c0",
                  ],
                },
                primaryColor: "brand",
              }}
              withGlobalStyles
              withNormalizeCSS
              withCSSVariables
            >
              <NotificationsProvider>
                <ModalsProvider>
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
                </ModalsProvider>
              </NotificationsProvider>
              <ReactQueryDevtools />
            </MantineProvider>
          </ColorSchemeProvider>
        </UserProvider>
      </QueryClientProvider>
    </>
  );
}
