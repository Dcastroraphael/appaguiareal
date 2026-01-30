import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenWrapper } from "../../components/ScreenWrapper";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";

// --- Interfaces ---
interface Membro {
  id: string;
  nome: string;
  unidade: string;
  foto?: string;
}

interface Evidencia {
  requisitoId: string;
  texto?: string;
  fotoUrl?: string;
  status: "pendente" | "aprovado";
  updatedAt?: any;
}

const { width } = Dimensions.get("window");
const IS_WEB = Platform.OS === "web";
const MAX_CONTENT_WIDTH = 900;

export default function GerenciarProgressoScreen() {
  const { user } = useAuth();
  const [membros, setMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);

  // Dicionário de evidências: { userId: [Evidencias] }
  const [evidenciasMembros, setEvidenciasMembros] = useState<
    Record<string, Evidencia[]>
  >({});

  const [busca, setBusca] = useState("");
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("Todas");

  const unidades = [
    "Todas",
    "Andorinha",
    "Arara",
    "Beija-flor",
    "Falcão",
    "Gaivota",
    "Gavião",
    "Harpia",
    "Pardal",
    "Rouxinol",
  ];

  useEffect(() => {
    fetchMembros();
  }, []);

  const fetchMembros = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "usuarios"),
        where("unidade", "!=", "Diretoria"),
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Membro[];
      setMembros(data.sort((a, b) => a.nome.localeCompare(b.nome)));
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar desbravadores.");
    } finally {
      setLoading(false);
    }
  };

  const carregarEvidenciasDoMembro = async (membroId: string) => {
    if (evidenciasMembros[membroId]) return;

    try {
      const q = query(
        collection(db, "progresso"),
        where("userId", "==", membroId),
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => d.data() as Evidencia);
      setEvidenciasMembros((prev) => ({ ...prev, [membroId]: docs }));
    } catch (e) {
      console.error("Erro evidencias:", e);
    }
  };

  const handleToggleExpandir = (membroId: string) => {
    if (expandido === membroId) {
      setExpandido(null);
    } else {
      setExpandido(membroId);
      carregarEvidenciasDoMembro(membroId);
    }
  };

  const handleToggleVisto = async (
    membroId: string,
    requisitoId: string,
    statusAtual: string,
  ) => {
    if (!user) return;

    try {
      const novoStatus = statusAtual === "aprovado" ? "pendente" : "aprovado";
      const docId = `${membroId}_${requisitoId}`;
      const docRef = doc(db, "progresso", docId);

      await updateDoc(docRef, {
        status: novoStatus,
        vistoPorNome: user.displayName || "Diretoria",
        vistoPorId: user.uid,
        dataVisto: serverTimestamp(),
      });

      setEvidenciasMembros((prev) => ({
        ...prev,
        [membroId]: prev[membroId].map((ev) =>
          ev.requisitoId === requisitoId ? { ...ev, status: novoStatus } : ev,
        ),
      }));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível assinar o requisito.");
    }
  };

  const membrosFiltrados = membros.filter((m) => {
    const matchNome = m.nome?.toLowerCase().includes(busca.toLowerCase());
    const matchUnidade =
      unidadeSelecionada === "Todas" || m.unidade === unidadeSelecionada;
    return matchNome && matchUnidade;
  });

  return (
    <ScreenWrapper titulo="Vistos de Classes">
      <View style={styles.mainContainer}>
        {/* Header de Busca e Filtros - Responsivo */}
        <View style={styles.filterSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nome..."
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.unidadesScroll}
            contentContainerStyle={styles.unidadesScrollContent}
          >
            {unidades.map((un) => (
              <TouchableOpacity
                key={un}
                onPress={() => setUnidadeSelecionada(un)}
                style={[
                  styles.filterBadge,
                  unidadeSelecionada === un && styles.filterBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    unidadeSelecionada === un && styles.filterTextActive,
                  ]}
                >
                  {un}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#8B0000"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={membrosFiltrados}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const evidencias = evidenciasMembros[item.id] || [];
              const concluidos = evidencias.filter(
                (e) => e.status === "aprovado",
              ).length;

              return (
                <View style={styles.card}>
                  <TouchableOpacity
                    style={styles.cardHeader}
                    onPress={() => handleToggleExpandir(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.avatarMini}>
                      {item.foto ? (
                        <Image
                          source={{ uri: item.foto }}
                          style={styles.avatarImg}
                        />
                      ) : (
                        <Ionicons name="person-circle" size={40} color="#DDD" />
                      )}
                    </View>

                    <View style={styles.infoArea}>
                      <Text style={styles.nome}>{item.nome}</Text>
                      <Text style={styles.subNome}>{item.unidade}</Text>
                    </View>

                    <View style={styles.progressBadge}>
                      <Text style={styles.progressText}>
                        {concluidos} vistos
                      </Text>
                      <Ionicons
                        name={
                          expandido === item.id ? "chevron-up" : "chevron-down"
                        }
                        size={18}
                        color="#8B0000"
                      />
                    </View>
                  </TouchableOpacity>

                  {expandido === item.id && (
                    <View style={styles.reqList}>
                      {evidencias.length === 0 ? (
                        <View style={styles.emptyState}>
                          <Ionicons
                            name="document-text-outline"
                            size={30}
                            color="#CCC"
                          />
                          <Text style={styles.emptyText}>
                            Sem evidências enviadas.
                          </Text>
                        </View>
                      ) : (
                        evidencias.map((ev) => (
                          <View
                            key={ev.requisitoId}
                            style={styles.reqItemAdmin}
                          >
                            <View style={styles.evidenciaInfo}>
                              <Text style={styles.reqId}>
                                REQUISITO: {ev.requisitoId}
                              </Text>
                              {ev.texto && (
                                <Text style={styles.reqAnotacao}>
                                  "{ev.texto}"
                                </Text>
                              )}
                              {ev.fotoUrl && (
                                <TouchableOpacity
                                  onPress={() =>
                                    Alert.alert(
                                      "Visualizar",
                                      "Abrir imagem em tela cheia?",
                                    )
                                  }
                                >
                                  <Image
                                    source={{ uri: ev.fotoUrl }}
                                    style={styles.miniFotoEvidencia}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>

                            <TouchableOpacity
                              style={[
                                styles.btnVisto,
                                ev.status === "aprovado" &&
                                  styles.btnVistoAtivo,
                              ]}
                              onPress={() =>
                                handleToggleVisto(
                                  item.id,
                                  ev.requisitoId,
                                  ev.status,
                                )
                              }
                            >
                              <Ionicons
                                name={
                                  ev.status === "aprovado"
                                    ? "checkmark-circle"
                                    : "remove-circle-outline"
                                }
                                size={18}
                                color="#fff"
                              />
                              <Text style={styles.btnVistoText}>
                                {ev.status === "aprovado"
                                  ? "Aprovado"
                                  : "Aprovar"}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))
                      )}
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center", // Centraliza no Web
  },
  filterSection: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      web: { boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" },
    }),
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  unidadesScroll: { marginTop: 15 },
  unidadesScrollContent: { paddingRight: 20 },
  filterBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  filterBadgeActive: { backgroundColor: "#8B0000", borderColor: "#8B0000" },
  filterText: { color: "#666", fontWeight: "bold", fontSize: 13 },
  filterTextActive: { color: "#fff" },

  listContent: {
    width: width > MAX_CONTENT_WIDTH ? MAX_CONTENT_WIDTH : width,
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    ...Platform.select({
      web: { transition: "0.2s" },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  avatarMini: {
    marginRight: 12,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEE",
  },
  infoArea: { flex: 1 },
  nome: { fontSize: 16, fontWeight: "700", color: "#333" },
  subNome: { fontSize: 12, color: "#8B0000", fontWeight: "600" },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  progressText: { fontSize: 12, fontWeight: "bold", color: "#8B0000" },

  reqList: {
    padding: 15,
    backgroundColor: "#FAFAFA",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  reqItemAdmin: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  evidenciaInfo: { flex: 1, paddingRight: 15 },
  reqId: { fontSize: 10, fontWeight: "800", color: "#AAA", marginBottom: 4 },
  reqAnotacao: { fontSize: 14, color: "#444", marginBottom: 6 },
  miniFotoEvidencia: {
    width: 100,
    height: 70,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: "#F0F0F0",
  },
  btnVisto: {
    backgroundColor: "#CCC",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minWidth: 100,
    justifyContent: "center",
  },
  btnVistoAtivo: { backgroundColor: "#2E7D32" },
  btnVistoText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  emptyState: { alignItems: "center", padding: 20 },
  emptyText: { color: "#999", fontSize: 13, marginTop: 5 },
});
