import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BaseStyles } from "./base.styles";
import { REPO_URL } from "../constants";
import Button from "../components/button";

export default function Page() {
  const { setOptions } = useNavigation();
  const { replace } = useRouter();
  useLayoutEffect(() => {
    setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <>
      <View style={BaseStyles.centeredContainer}>
        <Image
          source={require("../assets/brand/logo.png")}
          style={{ width: 163, height: 164 }}
        />
        <Text
          style={{
            ...BaseStyles.font700,
            fontSize: 30,
          }}
        >
          Lend My Skill
        </Text>
        <Text
          style={{
            ...BaseStyles.font500,
            fontSize: 16,
            color: "#38434D",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          India&apos;s First Open Source Freelance Platform
        </Text>
      </View>
      <View
        style={{
          ...BaseStyles.centeredContainer,
          flex: undefined,
          marginBottom: 50,
        }}
      >
        <Button
          onPress={() => {
            replace("/auth/login");
          }}
          title="Get Started"
          style={{
            paddingVertical: 10,
            borderRadius: 20,
            paddingHorizontal: Dimensions.get("screen").width / 4,
          }}
          textProps={{
            style: {},
          }}
        />
      </View>
      <View
        style={{
          ...BaseStyles.centeredContainer,
          flexDirection: "row",
          flex: undefined,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            ...BaseStyles.font500,
            fontSize: 16,
            color: "#38434D",
          }}
        >
          Made with ❤️ on{" "}
        </Text>
        <Pressable
          onPress={async () => {
            if (await Linking.canOpenURL(REPO_URL)) {
              Linking.openURL(REPO_URL);
            }
          }}
        >
          <Text
            style={{
              ...BaseStyles.font700,
              fontSize: 16,
              color: "#38bdf8",
            }}
          >
            {" "}
            Github
          </Text>
        </Pressable>
      </View>
    </>
  );
}
