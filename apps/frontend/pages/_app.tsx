import { AppProps } from "next/app";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import "@styles/globals.scss";
import { UserProvider } from "@context/user";
import { Header } from "@components/header";
import { inter, outfit } from "@fonts";
import { RouterTransition } from "@components/progress";
import { AnimatePresence, motion } from "framer-motion";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-phone-input-2/lib/style.css";
import { ModalsProvider } from "@mantine/modals";
import ErrorBoundary from "@components/error";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const client = new QueryClient();

export default function App(props: AppProps) {
  const { Component, pageProps } = props as any;

  const colorScheme: ColorScheme = "dark";

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <RouterTransition />
        <UserProvider>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={() => {}}
          >
            <MantineProvider
              theme={{
                colorScheme,
                fontFamily: outfit.style.fontFamily,
                colors: {
                  dark: [
                    "#C1C2C5",
                    "#A6A7AB",
                    "#909296",
                    "#5c5f66",
                    "#373A40",
                    "#2C2E33",
                    "#25262b",
                    "#0c0d14",
                    "#141517",
                    "#101113",
                  ],
                },
              }}
              withGlobalStyles
              withNormalizeCSS
              withCSSVariables
            >
              <NotificationsProvider>
                <ModalsProvider>
                  <div
                    className={
                      ["/", "/home"].includes(props.router.asPath)
                        ? "gradient"
                        : undefined
                    }
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
                        exit="exit"
                        key={props.router.pathname}
                      >
                        <Component {...pageProps} key={props.router.asPath} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </ModalsProvider>
              </NotificationsProvider>
              <ReactQueryDevtools />
            </MantineProvider>
          </ColorSchemeProvider>
        </UserProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
