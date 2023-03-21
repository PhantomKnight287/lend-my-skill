import React from "react";
import { Stack } from "expo-router";
import { TailwindProvider } from "tailwind-rn";
import utilities from "../tailwind.json";

export const unstable_settings = {
  initalRouteName: "test",
};

export default function Layout() {
  return (
    //@ts-ignore: trust me bro
    <TailwindProvider utilities={utilities}>
      <Stack
        screenOptions={{
          headerTitle: () => null,
        }}
      />
    </TailwindProvider>
  );
}
