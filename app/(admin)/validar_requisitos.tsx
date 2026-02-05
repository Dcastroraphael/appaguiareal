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
import { useUsuario } from "../../context/UsuarioContext";

interface RequisitoPendente {
  id: string;
  userId: string;
  requisitoId: string;
  resposta?: string;
  nomeUsuario: string;
  updatedAt?: any;
}

export default function ValidarRequisitosScreen() {
  const { usuario } = useUsuario();
  const [pendentes, setPendentes] = useState<RequisitoPendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Verificação de segurança: Só permite carregar se for diretoria
  const isDiretoria = ["Diretor", "Conselheiro", "Diretoria"].includes(
    usuario?.cargo || "",
  );

  const fetchPendentes = async () => {
    if (!isDiretoria) return;
    if (!refreshing) setLoading(true);

    try {
      const q = query(
        collection(db, "progresso"),
        where("status", "==", "pendente"),
        orderBy("updatedAt", "desc"),
      );

      const snap = await getDocs(q);

      const listaComNomes = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          let nomeDoMembro = "Membro Desconhecido";

          try {
            const userDoc = await getDoc(doc(db, "usuarios", data.userId));
            if (userDoc.exists()) {
              nomeDoMembro = userDoc.data().nome || "Sem Nome";
            }
          } catch (err) {
            console.error("Erro user fetch:", err);
          }

          return {
            id: d.id,
            ...data,
            nomeUsuario: nomeDoMembro,
          } as RequisitoPendente;
        }),
      );

      setPendentes(listaComNomes);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Falha ao sincronizar com o banco de dados.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendentes();
  }, [usuario]);

  const aprovarRequisito = async (docId: string) => {
    Alert.alert(
      "Confirmar Visto",
      "Deseja assinar este requisito como concluído?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, Assinar",
          onPress: async () => {
            try {
              const docRef = doc(db, "progresso", docId);
              await updateDoc(docRef, {
                status: "aprovado",
                dataAprovacao: new Date().toISOString(),
                aprovadoPor: usuario?.nome || "Diretoria",
              });

              setPendentes((prev) => prev.filter((item) => item.id !== docId));
            } catch (e) {
              Alert.alert("Erro", "Não foi possível salvar a aprovação.");
            }
          },
        },
      ],
    );
  };

  if (!isDiretoria) {
    return (
      <View style={styles.center}>
        <Text>Acesso restrito à diretoria.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: RequisitoPendente }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>DESBRAVADOR</Text>
          <Text style={styles.userName}>{item.nomeUsuario}</Text>
        </View>
        <Ionicons name="time-outline" size={24} color="#E67E22" />
      </View>

      <View style={styles.divider} />

      <Text style={styles.label}>REQUISITO</Text>
      <Text style={styles.reqId}>
        {item.requisitoId.replace(/_/g, " ").toUpperCase()}
      </Text>

      {item.resposta && (
        <View style={styles.respostaContainer}>
          <Text style={styles.labelSmall}>RESPOSTA DO MEMBRO:</Text>
          <Text style={styles.respostaText}>{item.resposta}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.btnAprovar}
        onPress={() => aprovarRequisito(item.id)}
      >
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
        <Text style={styles.btnText}>VALIDAR REQUISITO</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper titulo="Validar Requisitos" showBackButton={true}>
      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#8B0000" />
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
              <Ionicons name="happy-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>Tudo em dia!</Text>
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
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 10, fontWeight: "bold", color: "#999", marginBottom: 2 },
  labelSmall: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 4,
  },
  userName: { fontSize: 17, fontWeight: "bold", color: "#333" },
  reqId: {
    fontSize: 14,
    color: "#8B0000",
    marginBottom: 10,
    fontWeight: "600",
  },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 10 },
  respostaContainer: {
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  respostaText: { fontSize: 13, color: "#555", fontStyle: "italic" },
  btnAprovar: {
    backgroundColor: "#1B5E20",
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#999", marginTop: 10 },
});
