import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* Ícone de destaque para o Modal */}
      <View style={styles.iconContainer}>
        <Ionicons name="information-circle-outline" size={80} color="#ffd700" />
      </View>

      <ThemedText type="title" style={styles.title}>
        Informações do Sistema
      </ThemedText>

      <ThemedText style={styles.description}>
        Você está acessando o painel oficial do Clube de Desbravadores Águia
        Real. Este modal pode ser usado para exibir avisos rápidos ou detalhes
        de status.
      </ThemedText>

      {/* Botão estilizado para fechar/voltar */}
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <ThemedText style={styles.buttonText}>ENTENDIDO</ThemedText>
      </TouchableOpacity>

      {/* Link de retorno como fallback */}
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link" style={styles.linkText}>
          Voltar para o Início
        </ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#8B0000", // Mantendo o padrão bordô do app
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#ffd700", // Destaque em dourado
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: Platform.OS === "web" ? 200 : "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#8B0000",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    paddingVertical: 10,
  },
  linkText: {
    color: "#ffd700",
    textDecorationLine: "underline",
  },
});
