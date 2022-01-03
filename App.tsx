import React from "react";
import { StatusBar, StyleSheet } from "react-native";
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
import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./src/routes/app.routes";
import "intl";
import "intl/locale-data/jsonp/pt-BR";
import { SignIn } from "./src/screens/SignIn";
import { AuthProvider } from "./src/hooks/auth";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        {/* <Dashboard /> */}
        {/* <Register /> */}
        {/* <CategorySelect /> */}
        <AuthProvider>
          <SignIn />
        </AuthProvider>
        {/* <AppRoutes /> */}
      </NavigationContainer>
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
