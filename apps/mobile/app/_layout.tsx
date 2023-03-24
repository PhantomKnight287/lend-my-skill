import React, { ReactNode, useCallback } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { ScrollView, View } from "react-native";
import {
  Outfit_100Thin,
  Outfit_200ExtraLight,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
  useFonts,
} from "@expo-google-fonts/outfit";

preventAutoHideAsync();

export default function Layout() {
  const [fontLoaded] = useFonts({
    Outfit_100Thin,
    Outfit_200ExtraLight,
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) {
      await hideAsync();
    }
  }, [fontLoaded]);
  if (!fontLoaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <SafeAreaHandler>
            <Stack
              screenOptions={{
                headerTitle: () => null,
              }}
            />
          </SafeAreaHandler>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

const SafeAreaHandler = (props: { children: ReactNode }) => {
  return <SafeAreaView style={{ flex: 1 }}>{props.children}</SafeAreaView>;
};
