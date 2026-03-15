import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface Props {
  children: React.ReactNode;
  titulo: string;
  showBackButton?: boolean;
}

export function ScreenWrapper({ children, titulo, showBackButton }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />

      {/* 1. HEADER (Área Vermelha Fixa) */}
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          {showBackButton ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={30} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}

          <Image
            source={require("../assets/images/adaptive-icon.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.headerTitle}>{titulo}</Text>
      </View>

      {/* 2. O DIVISOR DIAGONAL (Fixado entre o Header e o Body) */}
      <View style={styles.diagonalDivider} pointerEvents="none" />

      {/* 3. CONTEÚDO (Área Cinza) */}
      <View style={styles.contentBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Fundo geral cinza claro
  },
  headerContainer: {
    backgroundColor: "#8B0000", // Vermelho Sangue de Boi
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 40, // Espaço extra para a diagonal não cortar o texto
    zIndex: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10,
  },
  placeholder: {
    width: 40,
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    lineHeight: 34,
  },
  diagonalDivider: {
    position: "absolute",
    top: 135, // Ajuste essa altura conforme o tamanho do seu header
    backgroundColor: "#F5F5F5",
    width: width * 1.5,
    height: 100,
    left: -20,
    transform: [{ rotate: "-6deg" }], // Rotação mais suave para não "comer" a tela
    zIndex: 1,
  },
  contentBody: {
    flex: 1,
    zIndex: 3,
    marginTop: -20, // Traz o conteúdo um pouco para cima para integrar com a diagonal
    paddingHorizontal: 15,
  },
});
