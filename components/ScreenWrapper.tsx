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
      {/* O fundo diagonal agora usa 'bottom' em vez de 'top' para garantir 
          que ele nunca suba conforme a tela cresce.
      */}
      <View style={styles.backgroundDiagonal} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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

        {/* Content com flex: 1 para ocupar o espaço e zIndex para 
            ficar acima da diagonal branca.
        */}
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B0000", // Fundo Sangue de Boi
    overflow: "hidden", // Impede que a diagonal vaze para fora da tela
  },
  safeArea: {
    flex: 1,
  },
  backgroundDiagonal: {
    position: "absolute",
    backgroundColor: "#F5F5F5",
    width: width * 2.5, // Aumentado para garantir cobertura lateral na rotação
    height: height,

    /* Ajuste Principal: Usamos bottom negativo. 
       Quanto maior o número negativo, mais para baixo a parte branca fica.
    */
    bottom: -height * 0.55,
    left: -width * 0.5,

    transform: [{ rotate: "-15deg" }],
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 25,
    paddingBottom: 10,
    zIndex: 30, // Garante que o texto do header fique sempre visível
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
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
    zIndex: 20, // Conteúdo acima da diagonal branca (zIndex 1)
    paddingHorizontal: 20, // Opcional: para o conteúdo não colar nas bordas
  },
});
