import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/firebase";

import { ScreenWrapper } from "../../components/ScreenWrapper";

interface UnidadeData {
  nome: string;
  total: number;
}

export default function UnidadesScreen() {
  const router = useRouter();
  const [unidadesComContagem, setUnidadesComContagem] = useState<UnidadeData[]>(
    [],
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query otimizada buscando apenas o campo necessário para contagem
    const q = query(collection(db, "usuarios"), orderBy("unidade"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const contagem: { [key: string]: number } = {};

        const UNIDADES_BASE = [
          "Diretoria",
          "Gavião",
          "Falcão",
          "Andorinha",
          "Harpia",
          "Rouxinol",
          "Pardal",
          "Beija-Flor",
          "Arara",
          "Gaivota",
        ];

        // Inicializa contagem com zero para as unidades padrão
        UNIDADES_BASE.forEach((u) => (contagem[u] = 0));

        snapshot.forEach((doc) => {
          const data = doc.data();
          const nomeUnidade = data.unidade;
          if (nomeUnidade) {
            contagem[nomeUnidade] = (contagem[nomeUnidade] || 0) + 1;
          }
        });

        const listaFormatada = Object.keys(contagem)
          .map((nome) => ({
            nome,
            total: contagem[nome],
          }))
          .sort((a, b) => a.nome.localeCompare(b.nome));

        setUnidadesComContagem(listaFormatada);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao escutar unidades: ", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Busca inteligente ignorando acentos e espaços extras
  const unidadesFiltradas = useMemo(() => {
    const termoNormalizado = search
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return unidadesComContagem.filter((u) =>
      u.nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(termoNormalizado),
    );
  }, [search, unidadesComContagem]);

  return (
    <ScreenWrapper titulo="Unidades do Clube" showBackButton={true}>
      <View style={styles.container}>
        {/* BARRA DE BUSCA */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Buscar por nome da unidade..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing" // Apenas iOS, mas bom ter
          />
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#8B0000" />
            <Text style={styles.loadingText}>Sincronizando unidades...</Text>
          </View>
        ) : (
          <FlatList
            data={unidadesFiltradas}
            keyExtractor={(item) => item.nome}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle-outline" size={60} color="#DDD" />
                <Text style={styles.emptyText}>
                  {search
                    ? `Nenhuma unidade com "${search}"`
                    : "Nenhuma unidade cadastrada."}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.6}
                onPress={() =>
                  router.push({
                    pathname: "/(admin)/membros-unidade",
                    params: { unidadeNome: item.nome },
                  } as any)
                }
              >
                <View style={styles.info}>
                  <View
                    style={[
                      styles.iconCircle,
                      item.nome === "Diretoria" && {
                        backgroundColor: "#FFF9E6",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        item.nome === "Diretoria" ? "ribbon" : "shield-half"
                      }
                      size={24}
                      color={item.nome === "Diretoria" ? "#DAA520" : "#8B0000"}
                    />
                  </View>
                  <View>
                    <Text style={styles.unitName}>{item.nome}</Text>
                    <Text style={styles.unitCount}>
                      {item.total}{" "}
                      {item.total === 1 ? "membro ativo" : "membros ativos"}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightSide}>
                  {item.total > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>VER</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#666", fontWeight: "500" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: "#333" },
  listPadding: { paddingHorizontal: 16, paddingBottom: 30 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  info: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F8F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  unitName: { fontSize: 17, fontWeight: "700", color: "#1A1A1A" },
  unitCount: { fontSize: 13, color: "#8E8E93", marginTop: 2 },
  rightSide: { flexDirection: "row", alignItems: "center" },
  badge: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeText: { fontSize: 10, fontWeight: "800", color: "#8E8E93" },
  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyText: {
    color: "#AAA",
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
    width: "80%",
  },
});
