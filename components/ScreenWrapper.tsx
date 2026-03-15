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
      {/* 1. BACKGROUND DIAGONAL 
          Colocado como primeiro elemento e com zIndex: 1
      */}
      <View style={styles.backgroundDiagonal} pointerEvents="none" />

      {/* 2. CONTEÚDO PRINCIPAL 
          Usamos uma View normal aqui porque o Drawer Navigation já aplica 
          a área segura no topo. O zIndex: 2 garante que fique ACIMA do branco.
      */}
      <View style={styles.mainContent}>
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

        {/* O children agora tem flex: 1 para empurrar o conteúdo corretamente */}
        <View style={styles.body}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B0000", // Fundo base Sangue de Boi
  },
  backgroundDiagonal: {
    position: "absolute",
    backgroundColor: "#F5F5F5",
    width: width * 2,
    height: height * 1.5,
    // Ajustado para começar bem abaixo e subir na diagonal
    bottom: -height * 0.4,
    left: -width * 0.3,
    transform: [{ rotate: "-15deg" }],
    zIndex: 1, // Camada mais baixa
  },
  mainContent: {
    flex: 1,
    zIndex: 2, // Garante que tudo aqui fique acima da diagonal
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 10, // Espaçamento reduzido para não bater no header do Drawer
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
    paddingHorizontal: 5, // Ajustado para dar liberdade ao conteúdo interno
  },
});
