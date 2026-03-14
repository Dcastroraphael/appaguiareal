import { useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const segments = useSegments();
  const router = useRouter();
  const { isReady, user } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    // Forçando como 'any' para o TypeScript parar de reclamar do índice [0]
    const s = segments as any;

    if (!user) {
      router.replace("/auth/login" as any);
    } else {
      router.replace("/(tabs)" as any);
    }
  }, [isReady, user]);

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
