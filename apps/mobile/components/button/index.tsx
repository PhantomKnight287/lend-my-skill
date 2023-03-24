import { ComponentProps } from "react";
import { Text, StyleSheet, Pressable } from "react-native";
interface Props extends ComponentProps<typeof Pressable> {
  onPress: () => void;
  title?: string;
  textProps?: ComponentProps<typeof Text>;
}

export default function Button(props: Props) {
  const { onPress, title = "Save" } = props;
  return (
    <Pressable
      style={StyleSheet.flatten([styles.button, props.style])}
      onPress={onPress}
    >
      <Text
        {...props.textProps}
        style={StyleSheet.flatten([styles.text, props.textProps?.style])}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
