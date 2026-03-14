import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { isReady, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady) {
      if (user) {
        router.replace("/(tabs)" as any);
      } else {
        router.replace("/auth/login" as any);
      }
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8B0000",
  },
});
