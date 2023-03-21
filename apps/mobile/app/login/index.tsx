import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useCallback, useState } from "react";
import { useTailwind } from "tailwind-rn";
import {
  useFonts,
  Overpass_400Regular,
  Overpass_700Bold,
} from "@expo-google-fonts/overpass";
import { Link } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Test() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const t = useTailwind();
  const [fontLoaded] = useFonts({
    Overpass_400Regular,
    Overpass_700Bold,
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontLoaded]);
  if (!fontLoaded) {
    return null;
  }
  return (
    <>
      <View
        style={t("flex-1 flex justify-center items-center")}
        onLayout={onLayoutRootView}
      >
        <View style={t("w-[70%] my-2")}>
          <Text
            style={{
              fontFamily: "Overpass_400Regular",
              fontSize: 16,
              marginVertical: 10,
            }}
          >
            Email
          </Text>
          <TextInput
            placeholder="john@doe.com"
            textContentType="emailAddress"
            style={(styles.customFont, t("bg-gray-300 text-white py-1 px-2"))}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={t("w-[70%] my-2")}>
          <Text
            style={{
              fontFamily: "Overpass_400Regular",
              fontSize: 16,
              marginVertical: 10,
            }}
          >
            Password
          </Text>
          <TextInput
            secureTextEntry={true}
            style={(styles.customFont, t("bg-gray-300 text-white py-1 px-2"))}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <Link
          href="#"
          style={t("text-blue-500 py-2 px-4 bg-slate-300 rounded-md my-3")}
        >
          Login
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  customFont: {
    fontFamily: "Overpass_400Regular",
    fontSize: 16,
  },
});
