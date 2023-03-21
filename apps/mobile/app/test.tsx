import { View, Text } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn";

export default function Test() {
  const t = useTailwind();
  return (
    <View style={t("flex-1 flex")}>
      <Text style={t("text-blue-600 text-2xl")}>Test</Text>
    </View>
  );
}
