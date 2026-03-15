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
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />

      {/* 1. CAMADA DE FUNDO (Abaixo de tudo) */}
      <View style={styles.backgroundLayer} pointerEvents="none">
        {/* Lado Esquerdo Vermelho (já é o fundo do container) */}
        {/* Lado Direito Branco/Cinza com inclinação */}
        <View style={styles.whiteDiagonalSide} />
      </View>

      {/* 2. CAMADA DE INTERFACE (Acima do fundo) */}
      <View style={styles.uiLayer}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            {showBackButton ? (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={32} color="#fff" />
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

        {/* O conteúdo principal entra aqui, livre de qualquer bloqueio */}
        <View style={styles.contentContainer}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B0000", // Fundo base (Lado Esquerdo Vermelho)
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: "hidden",
  },
  whiteDiagonalSide: {
    position: "absolute",
    backgroundColor: "#F5F5F5", // Lado Direito Branco
    width: width * 1.5,
    height: height * 1.5,
    // Posicionamento para criar a divisão diagonal perfeita
    top: height * 0.15,
    left: width * 0.2, // Empurra o branco para a direita
    transform: [{ rotate: "-15deg" }],
  },
  uiLayer: {
    flex: 1,
    zIndex: 1, // Garante que tudo aqui fique acima da diagonal visual
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10,
  },
  placeholder: {
    width: 45,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    lineHeight: 34,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 10,
  },
});
