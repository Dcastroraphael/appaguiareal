import React from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

export function Loading() {
  return (
    <View style={styles.container}>
      {/* 1. Use o componente Image do react-native */}
      <Image
        source={require("../../assets/logo.png")} // 2. Ajuste o caminho para a sua imagem
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#FFD700" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B0000",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120, // 3. Defina um tamanho fixo para a logo
    height: 120,
    marginBottom: 20, // Espaço entre a logo e o carregando
  },
});
