import { Redirect } from "expo-router";

export default function Index() {
  // Redireciona para o grupo de abas. O Layout cuidará de conferir o login.
  return <Redirect href="/(tabs)" />;
}
