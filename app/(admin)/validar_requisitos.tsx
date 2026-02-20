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
  Image,
  Modal,
  ScrollView,
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
  fotos?: string[];
  nomeUsuario: string;
  updatedAt?: any;
}

export default function ValidarRequisitosScreen() {
  const { usuario } = useUsuario();
  const [pendentes, setPendentes] = useState<RequisitoPendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fotoZoom, setFotoZoom] = useState<string | null>(null);

  const isDiretoria = [
    "Diretor",
    "Conselheiro",
    "Diretoria",
    "Instrutor",
  ].includes(usuario?.cargo || "");

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
            if (userDoc.exists())
              nomeDoMembro = userDoc.data().nome || "Sem Nome";
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

  const renderItem = ({ item }: { item: RequisitoPendente }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>DESBRAVADOR</Text>
          <Text style={styles.userName}>{item.nomeUsuario}</Text>
        </View>
        <View style={styles.badgePendente}>
          <Ionicons name="time" size={14} color="#E67E22" />
          <Text style={styles.badgeText}>PENDENTE</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.label}>REQUISITO</Text>
      <Text style={styles.reqId}>
        {item.requisitoId.replace(/_/g, " ").toUpperCase()}
      </Text>

      {/* SEÇÃO DE RESPOSTA/TEXTO */}
      {item.resposta ? (
        <View style={styles.respostaContainer}>
          <Text style={styles.labelSmall}>RELATÓRIO / RESPOSTA:</Text>
          <Text style={styles.respostaText}>{item.resposta}</Text>
        </View>
      ) : (
        <View style={styles.infoVazia}>
          <Text style={styles.textoInfoVazia}>Nenhum texto enviado.</Text>
        </View>
      )}

      {/* SEÇÃO DE FOTOS/EVIDÊNCIAS */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.labelSmall}>EVIDÊNCIAS (FOTOS):</Text>
        {item.fotos && item.fotos.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollFotos}
          >
            {item.fotos.map((url, index) => (
              <TouchableOpacity key={index} onPress={() => setFotoZoom(url)}>
                <Image source={{ uri: url }} style={styles.miniFotoEvidencia} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.textoInfoVazia}>Nenhuma foto anexada.</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.btnAprovar}
        onPress={() => aprovarRequisito(item.id)}
      >
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
        <Text style={styles.btnText}>DAR VISTO OFICIAL</Text>
      </TouchableOpacity>

      {/* Modal para ver a foto em tamanho maior */}
      <Modal visible={!!fotoZoom} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setFotoZoom(null)}
          >
            <Ionicons name="close-circle" size={40} color="#fff" />
          </TouchableOpacity>
          {fotoZoom && (
            <Image
              source={{ uri: fotoZoom }}
              style={styles.fotoGrande}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );

  return (
    <ScreenWrapper titulo="Validar Requisitos" showBackButton={true}>
      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#8B0000" />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Buscando pendências...
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
              <Ionicons
                name="checkmark-done-circle-outline"
                size={100}
                color="#ddd"
              />
              <Text style={styles.emptyText}>
                Excelente! Não há requisitos pendentes.
              </Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  list: { padding: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  badgePendente: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: { fontSize: 10, fontWeight: "bold", color: "#E67E22" },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#aaa",
    marginBottom: 2,
    letterSpacing: 1,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8B0000",
    marginBottom: 8,
  },
  userName: { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
  reqId: {
    fontSize: 15,
    color: "#8B0000",
    marginBottom: 15,
    fontWeight: "700",
  },
  divider: { height: 1, backgroundColor: "#F2F2F2", marginVertical: 12 },
  respostaContainer: {
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#8B0000",
  },
  respostaText: { fontSize: 14, color: "#444", lineHeight: 20 },
  infoVazia: { marginBottom: 15 },
  textoInfoVazia: { fontSize: 12, color: "#bbb", fontStyle: "italic" },
  scrollFotos: { marginTop: 5 },
  miniFotoEvidencia: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
  },
  btnAprovar: {
    backgroundColor: "#27AE60",
    flexDirection: "row",
    paddingVertical: 15,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    elevation: 2,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: "#bbb",
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
  },
  // Estilos do Modal de Zoom
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalClose: { position: "absolute", top: 50, right: 20, zIndex: 10 },
  fotoGrande: { width: "95%", height: "80%" },
});
