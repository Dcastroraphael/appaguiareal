import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import * as requisitosData from "../../data/requisitos";
import { useProgress } from "../../hooks/useProgress";

export default function DetalheClasse() {
  const { id } = useLocalSearchParams();
  const { concluidos, toggleRequisito } = useProgress();

  const categorias = (requisitosData as any)[String(id).toLowerCase()] || [];

  return (
    <ScreenWrapper titulo="Requisitos" showBackButton={true}>
      <ScrollView contentContainerStyle={styles.container}>
        {categorias.map((cat: any, index: number) => (
          <View key={index} style={styles.section}>
            <Text style={styles.tituloCategoria}>
              {cat.categoria.toUpperCase()}
            </Text>

            {cat.itens.map((item: any) => {
              const progresso = concluidos?.find((c) => c.id === item.id);
              const isChecked = !!progresso;
              const isAprovado = progresso?.status === "aprovado";

              return (
                <View key={item.id} style={styles.requisitoRow}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => toggleRequisito(item.id)}
                    disabled={isAprovado}
                  >
                    <Ionicons
                      name={
                        isAprovado
                          ? "ribbon"
                          : isChecked
                            ? "checkbox"
                            : "square-outline"
                      }
                      size={24}
                      color={
                        isAprovado ? "#FFD700" : isChecked ? "#4CAF50" : "#999"
                      }
                    />
                  </TouchableOpacity>
                  <Text style={styles.requisitoTexto}>{item.texto}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  section: { marginBottom: 25 },
  tituloCategoria: {
    color: "#BBB",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 15,
    letterSpacing: 1,
  },
  requisitoRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  checkbox: { marginRight: 12 },
  requisitoTexto: { flex: 1, color: "#FFF", fontSize: 15, lineHeight: 20 },
});
