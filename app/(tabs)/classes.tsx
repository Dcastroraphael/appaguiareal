import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react"; // Adicionado useCallback
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { classes } from "../../data/classes";
import * as requisitos from "../../data/requisitos";
import { useProgress } from "../../hooks/useProgress";

// Tipagem mantida
type RequisitoItem = {
  id: string;
  texto: string;
  somenteTexto?: boolean;
  permiteTexto?: boolean;
};

type Categoria = {
  categoria: string;
  itens: RequisitoItem[];
};

export default function Classes() {
  const router = useRouter();
  const { concluidos } = useProgress();

  // UseCallback evita que a função seja recriada toda hora, melhorando a performance da lista
  const getProgressoClasse = useCallback(
    (classeId: string) => {
      if (!classeId) return { porcentagem: 0, temPendentes: false };

      const idLimpo = String(classeId).toLowerCase();
      const baseRequisitos = requisitos as unknown as Record<
        string,
        Categoria[]
      >;
      const categoriasData = baseRequisitos[idLimpo];

      if (!categoriasData || !Array.isArray(categoriasData)) {
        return { porcentagem: 0, temPendentes: false };
      }

      const itensReais = categoriasData.flatMap((cat) =>
        Array.isArray(cat.itens)
          ? cat.itens.filter((item) => !item.somenteTexto)
          : [],
      );

      if (itensReais.length === 0)
        return { porcentagem: 0, temPendentes: false };

      const listaConcluidos = Array.isArray(concluidos) ? concluidos : [];

      // Contagem de aprovados
      const aprovadosCount = itensReais.filter((item) =>
        listaConcluidos.some(
          (c) => c?.id === item.id && c.status === "aprovado",
        ),
      ).length;

      // Verificação de pendentes
      const temPendentes = itensReais.some((item) =>
        listaConcluidos.some(
          (c) => c?.id === item.id && c.status === "pendente",
        ),
      );

      return {
        porcentagem: aprovadosCount / itensReais.length,
        temPendentes,
      };
    },
    [concluidos],
  );

  const handlePress = (id: string) => {
    // Verifique se o caminho da pasta é exatamente este.
    // Se sua pasta for "classesStack", o arquivo dentro deve ser "[id].tsx"
    if (id) {
      router.push(`/classesStack/${id}` as any);
    }
  };

  return (
    <ScreenWrapper titulo="Minhas Classes" showBackButton={false}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true} // Melhora performance de listas longas
        renderItem={({ item }) => {
          const infoProgresso = getProgressoClasse(item.id);
          const valorProgresso = infoProgresso.porcentagem * 100;

          return (
            <TouchableOpacity
              style={[styles.item, { backgroundColor: item.cor || "#333" }]}
              activeOpacity={0.8}
              onPress={() => handlePress(item.id)}
            >
              <View style={styles.headerItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemText}>{item.nome}</Text>

                  {infoProgresso.temPendentes && (
                    <View style={styles.badgePendente}>
                      <Ionicons name="time-outline" size={12} color="#fff" />
                      <Text style={styles.textPendente}>Aguardando Visto</Text>
                    </View>
                  )}
                </View>

                <View style={styles.percentageContainer}>
                  <Text style={styles.percentageText}>
                    {Math.round(valorProgresso)}%
                  </Text>
                </View>
              </View>

              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.max(2, valorProgresso)}%` }, // Mínimo de 2% para visibilidade
                  ]}
                />
              </View>

              <Text style={styles.footerText}>
                {Math.round(valorProgresso) === 100
                  ? "Classe Concluída! 🎉"
                  : "Baseado em requisitos assinados pelo instrutor"}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  // ... seus estilos permanecem iguais
  listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  item: { padding: 20, marginBottom: 16, borderRadius: 20, elevation: 4 },
  headerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  itemText: { fontSize: 22, color: "#fff", fontWeight: "800" },
  percentageContainer: {
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  percentageText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  progressBg: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#FFD700", borderRadius: 5 },
  badgePendente: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
  },
  textPendente: {
    color: "#fff",
    fontSize: 10,
    marginLeft: 4,
    fontWeight: "bold",
  },
  footerText: {
    color: "#fff",
    fontSize: 11,
    marginTop: 10,
    opacity: 0.9,
    fontStyle: "italic",
  },
});
