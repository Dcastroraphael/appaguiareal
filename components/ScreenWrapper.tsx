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

      {/* 1. FUNDO DIVIDIDO (DIAGONAL) */}
      <View style={styles.backgroundLayer} pointerEvents="none">
        {/* A parte branca que entra da direita para a esquerda */}
        <View style={styles.whiteDiagonalSide} />
      </View>

      {/* 2. CONTEÚDO DA INTERFACE */}
      <View style={styles.uiLayer}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            {showBackButton ? (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                activeOpacity={0.7}
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

        {/* Área onde os cards e listas aparecem */}
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
    width: width * 2,
    height: height * 1.2,
    // Ajuste fino para a diagonal começar no ponto certo do topo
    top: height * 0.12,
    left: width * 0.25,
    transform: [{ rotate: "-15deg" }],
  },
  uiLayer: {
    flex: 1,
    zIndex: 1, // Mantém botões e textos clicáveis e visíveis acima do fundo
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 5,
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
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 15,
  },
});
