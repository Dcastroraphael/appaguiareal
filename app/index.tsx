import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  // NENHUM REDIRECIONAMENTO AQUI. O _layout.tsx FARÁ ISSO.
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffd700" />
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
});
