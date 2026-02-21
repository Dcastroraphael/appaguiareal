import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  query,
  where
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
import { useProgress } from "../../hooks/useProgress"; // Ou seu Context

export default function ValidarRequisitosScreen() {
  const [pendentes, setPendentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { validarRequisito } = useProgress(); // Usando a função que criamos no contexto

  // 1. Busca todos os requisitos com status "pendente" no banco
  useEffect(() => {
    const q = query(
      collection(db, "progresso"),
      where("status", "==", "pendente"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setPendentes(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleValidar = async (item: any) => {
    try {
      // Chamada para alterar o status no Firebase para "aprovado"
      await validarRequisito(item.userId, item.requisitoId);
      Alert.alert("Sucesso", "Requisito validado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível validar o requisito.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.label}>DESBRAVADOR</Text>
          <Text style={styles.nomeMembro}>
            {item.userName || "Membro"}{" "}
            {/* Ideal buscar o nome na coleção usuarios */}
          </Text>
        </View>
        <Ionicons name="time-outline" size={20} color="#E67E22" />
      </View>

      <View style={styles.bodyCard}>
        <Text style={styles.label}>REQUISITO</Text>
        <Text style={styles.requisitoId}>{item.requisitoId.toUpperCase()}</Text>
      </View>

      <TouchableOpacity
        style={styles.btnValidar}
        onPress={() => handleValidar(item)}
      >
        <Ionicons name="checkmark-circle" size={18} color="#FFF" />
        <Text style={styles.btnText}>VALIDAR REQUISITO</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper titulo="Validar Requisitos">
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#8B0000"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={pendentes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.empty}>Nenhum requisito pendente.</Text>
            }
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15 },
  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  label: { fontSize: 10, color: "#999", fontWeight: "bold" },
  nomeMembro: { fontSize: 16, fontWeight: "bold", color: "#333" },
  bodyCard: { marginBottom: 15 },
  requisitoId: { fontSize: 14, fontWeight: "bold", color: "#8B0000" },
  btnValidar: {
    backgroundColor: "#1B5E20",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },
  empty: { textAlign: "center", marginTop: 50, color: "#666" },
});
