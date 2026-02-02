import { Ionicons } from "@expo/vector-icons";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { db } from "../../config/firebase";

// Interface para garantir que o TypeScript entenda os dados do requisito
interface RequisitoPendente {
  id: string;
  userId: string;
  requisitoId: string;
  resposta?: string;
  nomeUsuario: string; // Campo extra que buscaremos
  updatedAt?: any;
}

export default function ValidarRequisitosScreen() {
  const [pendentes, setPendentes] = useState<RequisitoPendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Busca os requisitos e os nomes dos usuários em paralelo
  const fetchPendentes = async () => {
    if (!refreshing) setLoading(true);
    try {
      const q = query(
        collection(db, "progresso"),
        where("status", "==", "pendente"),
        orderBy("updatedAt", "desc"),
      );

      const snap = await getDocs(q);

      // Mágica: Para cada requisito, buscamos o nome do usuário na coleção 'usuarios'
      const listaComNomes = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          let nomeDoMembro = "Membro Desconhecido";

          try {
            // Tenta buscar o documento do usuário pelo ID salvo no progresso
            const userDoc = await getDoc(doc(db, "usuarios", data.userId));
            if (userDoc.exists()) {
              nomeDoMembro = userDoc.data().nome || "Sem Nome";
            }
          } catch (err) {
            console.log(`Erro ao buscar nome do user ${data.userId}:`, err);
          }

          return {
            id: d.id,
            userId: data.userId,
            requisitoId: data.requisitoId,
            resposta: data.resposta,
            nomeUsuario: nomeDoMembro,
            updatedAt: data.updatedAt,
          } as RequisitoPendente;
        }),
      );

      setPendentes(listaComNomes);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível carregar os requisitos pendentes.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendentes();
  }, []);

  // Função para dar o "Visto" oficial
  const aprovarRequisito = async (docId: string) => {
    try {
      const docRef = doc(db, "progresso", docId);
      await updateDoc(docRef, {
        status: "aprovado",
        dataAprovacao: new Date().toISOString(),
      });

      // Remove da lista local para dar feedback imediato na UI
      setPendentes((prev) => prev.filter((item) => item.id !== docId));
      Alert.alert("Sucesso!", "Visto oficial aplicado.");
    } catch (e) {
      Alert.alert("Erro", "Falha ao aprovar requisito.");
    }
  };

  const renderItem = ({ item }: { item: RequisitoPendente }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>DESBRAVADOR</Text>
          <Text style={styles.userName}>{item.nomeUsuario}</Text>
          <Text style={styles.userIdSubtle}>
            ID: {item.userId.substring(0, 8)}...
          </Text>
        </View>
        <Ionicons name="time-outline" size={24} color="#E67E22" />
      </View>

      <View style={styles.divider} />

      <Text style={styles.label}>REQUISITO DE CLASSE</Text>
      <Text style={styles.reqId}>
        {item.requisitoId.replace(/_/g, " ").toUpperCase()}
      </Text>

      {item.resposta && (
        <View style={styles.respostaContainer}>
          <Text style={styles.labelSmall}>RELATÓRIO DO MEMBRO:</Text>
          <Text style={styles.respostaText}>"{item.resposta}"</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.btnAprovar}
        onPress={() => aprovarRequisito(item.id)}
      >
        <Ionicons name="ribbon" size={20} color="#fff" />
        <Text style={styles.btnText}>DAR VISTO OFICIAL</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper titulo="Validar Classes" showBackButton={true}>
      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#8B0000" />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Carregando pedidos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={pendentes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchPendentes();
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle" size={80} color="#ccc" />
              <Text style={styles.emptyText}>
                Tudo em dia!{"\n"}Nenhum desbravador aguardando visto.
              </Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  list: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#999",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  labelSmall: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 4,
  },
  userName: { fontSize: 18, fontWeight: "700", color: "#333" },
  userIdSubtle: { fontSize: 10, color: "#BBB" },
  reqId: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8B0000",
    marginBottom: 15,
  },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 12 },
  respostaContainer: {
    backgroundColor: "#FFF8F8",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#8B0000",
    marginBottom: 20,
  },
  respostaText: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
    lineHeight: 20,
  },
  btnAprovar: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  emptyContainer: { alignItems: "center", marginTop: 100, opacity: 0.6 },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 15,
    fontSize: 16,
    lineHeight: 24,
  },
});
