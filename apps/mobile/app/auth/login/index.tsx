import { View, TextInput, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { BaseStyles } from "../../base.styles";
import { Formik } from "formik";
import Button from "../../../components/button";

export default function Test() {
  return (
    <View
      style={{
        ...BaseStyles.centeredContainer,
      }}
    >
      <Formik
        initialValues={{ email: "" }}
        onSubmit={(values) => console.log(values)}
        validateOnBlur
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <View style={{}}>
              <Text
                style={{
                  ...BaseStyles.font500,
                  fontSize: 16,
                }}
              >
                Email
              </Text>

              <TextInput
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
            </View>

            <Button onPress={handleSubmit} title="Submit" />
          </>
        )}
      </Formik>
    </View>
  );
}
