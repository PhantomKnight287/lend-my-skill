import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
        <View style={styles.links}>
          <Link href={"/test"}>Test</Link>
          <Link href={"/login"}>Login</Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    color: "#38434D",
  },
  links: {
    marginVertical: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
