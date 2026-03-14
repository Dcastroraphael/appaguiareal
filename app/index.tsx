import { Redirect } from "expo-router";

/**
 * Este arquivo serve apenas como o "porteiro" da aplicação.
 * Ele redireciona o fluxo inicial para dentro do grupo de abas.
 */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
