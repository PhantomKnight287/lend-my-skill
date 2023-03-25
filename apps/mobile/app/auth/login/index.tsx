import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Link, useNavigation } from "expo-router";
import { BaseStyles } from "../../base.styles";
import { Formik } from "formik";
import Button from "../../../components/button";
import { LoginStyles } from "./login.styles";
import { Image, Input } from "@rneui/base";
import { Entypo } from "@expo/vector-icons";

export default function Login() {
  const { setOptions } = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  useLayoutEffect(() => {
    setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <KeyboardAvoidingView style={{ padding: 20, flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={BaseStyles.centeredContainer}>
          <Image
            source={require("../../../assets/brand/logo.png")}
            style={{ width: 164, height: 164 }}
          />
        </View>
        <Text
          style={{
            ...BaseStyles.font500,
            fontSize: 24,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Login to your account
        </Text>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => console.log(values)}
          validateOnBlur
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View
              style={{
                ...BaseStyles.container,
                alignItems: "stretch",
                justifyContent: "flex-start",
              }}
            >
              <View>
                <Text
                  style={{
                    ...BaseStyles.font500,
                    fontSize: 16,
                  }}
                >
                  Email
                </Text>

                <Input
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  style={LoginStyles.input}
                  keyboardType="email-address"
                  placeholder="me@mail.com"
                  underlineColorAndroid="transparent"
                  errorMessage={errors.email}
                  inputContainerStyle={{
                    borderBottomColor: "transparent",
                  }}
                />
              </View>
              <View
                style={{
                  marginBottom: "auto",
                }}
              >
                <Text
                  style={{
                    ...BaseStyles.font500,
                    fontSize: 16,
                  }}
                >
                  Password
                </Text>

                <Input
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  keyboardType="default"
                  placeholder={passwordVisible ? "password" : "********"}
                  secureTextEntry={!passwordVisible}
                  underlineColorAndroid="transparent"
                  errorMessage={errors.password}
                  inputContainerStyle={{
                    borderBottomColor: "transparent",
                    ...LoginStyles.input,
                  }}
                  rightIcon={
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                      <Entypo
                        name={passwordVisible ? "eye-with-line" : "eye"}
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  }
                />
              </View>

              <Button
                onPress={handleSubmit}
                style={{
                  marginBottom: 20,
                  borderRadius: 20,
                }}
                title="Login"
              />
            </View>
          )}
        </Formik>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              ...BaseStyles.font500,
              fontSize: 16,
            }}
          >
            Don't have an account?{" "}
          </Text>
          <Link href="/auth/register">
            <Text
              style={{
                ...BaseStyles.font500,
                fontSize: 16,
                color: "#3F51B5",
              }}
            >
              Register
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
