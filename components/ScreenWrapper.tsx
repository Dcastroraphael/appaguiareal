import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface Props {
  children: React.ReactNode;
  titulo: string;
  showBackButton?: boolean;
}

export function ScreenWrapper({ children, titulo, showBackButton }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Fundo Diagonal Fixo */}
      <View style={styles.backgroundDiagonal} />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            {showBackButton ? (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                {/* Chevron é mais elegante para "Voltar" */}
                <Ionicons name="chevron-back" size={32} color="#fff" />
              </TouchableOpacity>
            ) : (
              // View com tamanho fixo para manter o Logo na direita sempre na mesma posição
              <View style={styles.placeholder} />
            )}

            <Image
              source={require("../assets/images/adaptive-icon.png")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.headerTitle}>{titulo}</Text>
        </View>

        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B0000",
  },
  safeArea: {
    flex: 1,
  },
  backgroundDiagonal: {
    position: "absolute",
    backgroundColor: "#F5F5F5", // Um cinza bem claro ou branco puro
    width: width * 2,
    height: height,
    top: height * 0.65,
    left: -width * 0.5,
    transform: [{ rotate: "-12deg" }],
  },
  header: {
    paddingHorizontal: 25,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10, // Ajustado para SafeAreaView
  },
  backButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10, // Compensa o padding interno do ícone
  },
  placeholder: {
    width: 45, // Mesmo tamanho do botão de voltar
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 15,
    lineHeight: 38,
  },
  content: {
    flex: 1,
    zIndex: 10, // Garante que o conteúdo fique acima do fundo diagonal
  },
});
