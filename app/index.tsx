import { Redirect } from "expo-router";

export default function Index() {
  // O _layout.tsx já vai interceptar isso e validar o login.
  return <Redirect href="/(tabs)" />;
}
