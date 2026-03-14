import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{ flex: 1, backgroundColor: "#8B0000", justifyContent: "center" }}
    >
      <ActivityIndicator size="large" color="#ffd700" />
    </View>
  );
}
