import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
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

// Mapeamento de cores oficiais por classe
const CORES_CLASSES: Record<string, string> = {
  amigo: "#0000FF", // Azul
  companheiro: "#FF0000", // Vermelho
  pesquisador: "#008000", // Verde
  pioneiro: "#493e49", // Cinza
  excursionista: "#7919a5", // Roxo
  guia: "#d8e708", // Amarelo
};

export default function DetalheClasse() {
  const { id } = useLocalSearchParams();
  const { concluidos, toggleRequisito } = useProgress();

  const classeId = String(id).toLowerCase();
  const categorias = (requisitosData as any)[classeId] || [];

  // Define a cor do card baseada na classe, com um fallback bordô
  const corBase = CORES_CLASSES[classeId] || "#8B0000";

  return (
    <ScreenWrapper titulo="Requisitos" showBackButton={true}>
      {/* 1. REMOVE O ID DO TOPO (Header nativo do Expo) */}
      <Stack.Screen options={{ title: "", headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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
                /* 2. CARD COM A COR DA CLASSE AO FUNDO */
                <View
                  key={item.id}
                  style={[styles.requisitoCard, { backgroundColor: corBase }]}
                >
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
                      size={26}
                      color={isAprovado ? "#FFD700" : "#FFF"}
                    />
                  </TouchableOpacity>

                  <View style={styles.contentContainer}>
                    <Text style={styles.requisitoTexto}>{item.texto}</Text>

                    {/* Botão de Anexar Foto dentro do Card */}
                    <TouchableOpacity style={styles.btnFoto}>
                      <Ionicons name="camera" size={16} color="#FFF" />
                      <Text style={styles.btnFotoText}>Foto / Evidência</Text>
                    </TouchableOpacity>
                  </View>
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
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 15,
    letterSpacing: 1.5,
  },
  // ESTILO DO CARD COLORIDO
  requisitoCard: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 16,
    borderRadius: 15,
    alignItems: "flex-start",
    // Sombra para dar profundidade
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  requisitoTexto: {
    color: "#FFF",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 12,
  },
  // BOTÃO DE FOTO DENTRO DO CARD
  btnFoto: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)", // Fundo branco translúcido
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  btnFotoText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
