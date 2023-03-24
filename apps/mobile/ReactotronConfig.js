import Reactotron, { asyncStorage } from "reactotron-react-native";

Reactotron.configure() // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from // controls connection & communication settings
  .use(asyncStorage())
  .connect(); // let's connect!
