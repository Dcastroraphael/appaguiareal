import { Redirect } from "expo-router";

export default function Index() {
  // Redireciona para o grupo (tabs).
  // O Expo Router carregará automaticamente o index dentro dele.
  return <Redirect href="/(tabs)" />;
}
