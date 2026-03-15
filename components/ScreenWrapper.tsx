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
      {/* 1. FUNDO BRANCO FIXO (A parte de baixo) */}
      <View style={styles.whiteBackground} />

      {/* 2. DIAGONAL (Ajustada para ficar atrás e no lugar certo) */}
      <View style={styles.diagonalWrapper} pointerEvents="none">
        <View style={styles.backgroundDiagonal} />
      </View>

      {/* 3. CONTEÚDO (Z-Index alto e flexível) */}
      <View style={styles.mainContent}>
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

        <View style={styles.body}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B0000", // Parte de cima (Vermelho)
  },
  // Garante que a metade de baixo seja sempre branca
  whiteBackground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "60%",
    backgroundColor: "#F5F5F5",
  },
  diagonalWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: 0,
  },
  backgroundDiagonal: {
    position: "absolute",
    backgroundColor: "#F5F5F5",
    width: width * 2,
    height: height,
    top: height * 0.22, // Fixa o corte da diagonal exatamente aqui
    left: -width * 0.5,
    transform: [{ rotate: "-12deg" }],
  },
  mainContent: {
    flex: 1,
    zIndex: 10,
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 20,
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
  body: {
    flex: 1,
    paddingHorizontal: 15,
  },
});
