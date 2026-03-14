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
      {/* CORREÇÃO: O fundo diagonal agora tem zIndex: 1 para ficar atrás 
          e usamos pointerEvents="none" para ele nunca bloquear cliques no conteúdo
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

        {/* CORREÇÃO: Adicionado flex: 1 e zIndex: 20 para garantir 
            que os filhos (ScrollView, etc) sejam renderizados acima do fundo 
        */}
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B0000", // Fundo principal (Sangue de Boi)
  },
  safeArea: {
    flex: 1,
  },
  backgroundDiagonal: {
    position: "absolute",
    backgroundColor: "#F5F5F5",
    width: width * 2,
    height: height,
    // Ajustado para não subir demais e cobrir a tela em resoluções diferentes
    top: height * 0.7,
    left: -width * 0.5,
    transform: [{ rotate: "-12deg" }],
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 25,
    paddingBottom: 10,
    zIndex: 30, // Header sempre no topo
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
    zIndex: 20,
    // Garante que o conteúdo não fique "invisível" por falta de altura
    minHeight: 100,
  },
});
