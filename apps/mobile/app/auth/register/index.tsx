import { View, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Link, useNavigation } from "expo-router";
import { BaseStyles } from "../../base.styles";
import { Formik } from "formik";
import Button from "../../../components/button";
import { LoginStyles } from "../login/login.styles";
import { Image, Input } from "@rneui/base";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { object, string, ref } from "yup";
import SelectDropdown from "react-native-select-dropdown";
import { CountryPicker } from "react-native-country-codes-picker";

export default function Login() {
  const { setOptions } = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 20 }}>
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
          Create an Account to get started
        </Text>
        <Formik
          initialValues={{
            email: "",
            password: "",
            role: "",
            confirmPassword: "",
            country: "",
            username: "",
            name: "",
          }}
          onSubmit={(values) => console.log(values)}
          validateOnBlur
          validationSchema={object({
            name: string().required("Name is required"),
            username: string().required("Username is required"),
            email: string().required("Email is required"),
            password: string().required("Password is required"),
            confirmPassword: string().oneOf(
              [ref("password")],
              "Passwords must match"
            ),
            country: string().required("Country is required"),
            role: string().required("Role is required"),
          })}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            setFieldValue,
          }) => (
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
                  Name
                </Text>

                <Input
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  style={LoginStyles.input}
                  placeholder="John Doe"
                  underlineColorAndroid="transparent"
                  errorMessage={errors.name}
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
                  Email
                </Text>

                <Input
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  style={LoginStyles.input}
                  placeholder="me@mail.com"
                  underlineColorAndroid="transparent"
                  errorMessage={errors.email}
                  inputContainerStyle={{ borderBottomColor: "transparent" }}
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
                  Username
                </Text>

                <Input
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  style={LoginStyles.input}
                  placeholder="johndoe123"
                  underlineColorAndroid="transparent"
                  errorMessage={errors.username}
                  inputContainerStyle={{ borderBottomColor: "transparent" }}
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
                  placeholder={passwordVisible ? "password" : "********"}
                  underlineColorAndroid="transparent"
                  errorMessage={errors.password}
                  inputContainerStyle={{
                    borderBottomColor: "transparent",
                    ...LoginStyles.input,
                  }}
                  secureTextEntry={!passwordVisible}
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
                  Confirm Password
                </Text>

                <Input
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  placeholder={passwordVisible ? "password" : "********"}
                  underlineColorAndroid="transparent"
                  errorMessage={errors.confirmPassword}
                  inputContainerStyle={{
                    borderBottomColor: "transparent",
                    ...LoginStyles.input,
                  }}
                  secureTextEntry={!passwordVisible}
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
              <View
                style={{
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    ...BaseStyles.font500,
                    fontSize: 16,
                  }}
                >
                  Role
                </Text>

                <SelectDropdown
                  data={["Freelancer", "Client"]}
                  onSelect={(d) => {
                    setFieldValue("role", d);
                  }}
                  defaultValue={values.role}
                  rowStyle={{ flex: 1 }}
                  buttonStyle={{ ...LoginStyles.input, flex: 1, width: "100%" }}
                  buttonTextStyle={{ ...BaseStyles.font500, fontSize: 16 }}
                  rowTextStyle={{ ...BaseStyles.font500, fontSize: 16 }}
                />
              </View>
              <View
                style={{
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    ...BaseStyles.font500,
                    fontSize: 16,
                  }}
                >
                  Country
                </Text>
                <TouchableOpacity
                  onPress={() => setShow(true)}
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 20,
                    backgroundColor: "rgb(213,209,219)",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      ...BaseStyles.font500,
                    }}
                  >
                    {values.country || "Select Country"}
                  </Text>
                </TouchableOpacity>

                <CountryPicker
                  show={show}
                  lang="en"
                  pickerButtonOnPress={(d) => {
                    setFieldValue("country", d.name["en"]);
                    setShow((o) => !o);
                  }}
                  disableBackdrop
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
            Already have an account?{" "}
          </Text>
          <Link href="/auth/login">
            <Text
              style={{
                ...BaseStyles.font500,
                fontSize: 16,
                color: "#3F51B5",
              }}
            >
              Login
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
