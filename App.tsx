import React from "react";
import { StyleSheet } from "react-native";
import { ThemeProvider } from "styled-components";
import { Dashboard } from "./src/screens/Dashboard";
import theme from "./src/global/styles/theme";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import AppLoading from "expo-app-loading";
import { Register } from "./src/screens/Register";
import { CategorySelect } from "./src/screens/CategorySelct";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }
  return (
    <ThemeProvider theme={theme}>
      {/* <Dashboard /> */}
      <Register />
      {/* <CategorySelect /> */}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
