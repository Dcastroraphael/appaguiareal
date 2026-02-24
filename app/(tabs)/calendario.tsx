import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

// Firebase
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../config/firebase";

// Componentes e Contexto
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { useAuth } from "../../context/AuthContext";

export default function AgendaScreen() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // Define se o usuário tem permissões administrativas
  const ehAdmin = user?.role === "admin" || user?.email?.includes("diretor");

  // Escuta os eventos do Firestore em tempo real
  useEffect(() => {
    const q = query(collection(db, "eventos"), orderBy("criadoEm", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const listaEventos = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));
        setEventos(listaEventos);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao carregar agenda:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Função para remover o evento do banco de dados
  const handleRemoverEvento = (id: string, titulo: string) => {
    Alert.alert(
      "Remover Evento",
      `Tem certeza que deseja excluir o evento "${titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // Deleta o documento específico no Firestore
              await deleteDoc(doc(db, "eventos", id));
              // O onSnapshot cuidará de remover o item da lista automaticamente
            } catch (error) {
              console.error("Erro ao deletar:", error);
              Alert.alert("Erro", "Não foi possível remover o evento.");
            }
          },
        },
      ],
    );
  };

  // Renderização de cada card de evento
  const renderEvento = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardStripe} />

      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>{item.titulo}</Text>

          <View style={styles.headerActions}>
            {item.hora && (
              <View style={styles.badge}>
                <Ionicons name="time-outline" size={12} color="#333" />
                <Text style={styles.badgeText}>{item.hora}</Text>
              </View>
            )}

            {/* Ícone de lixeira visível apenas para administradores */}
            {ehAdmin && (
              <TouchableOpacity
                onPress={() => handleRemoverEvento(item.id, item.titulo)}
                style={styles.deleteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={20} color="#8B0000" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.data}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.local}</Text>
        </View>

        {item.descricao ? (
          <Text style={styles.descricao} numberOfLines={3}>
            {item.descricao}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <ScreenWrapper titulo="Agenda do Clube">
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffd700" />
          </View>
        ) : eventos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-clear-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum evento programado.</Text>
          </View>
        ) : (
          <FlatList
            data={eventos}
            keyExtractor={(item) => item.id}
            renderItem={renderEvento}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Botão flutuante para criar novos eventos (Admin apenas) */}
        {ehAdmin && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push("/(admin)/novo_evento")}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={30} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { padding: 20, paddingBottom: 100 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { color: "#999", marginTop: 10, fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardStripe: {
    width: 6,
    backgroundColor: "#ffd700",
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B0000",
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    padding: 4,
  },
  badge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#333" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 8,
  },
  infoText: {
    color: "#555",
    fontSize: 14,
  },
  descricao: {
    marginTop: 8,
    color: "#777",
    fontSize: 13,
    lineHeight: 18,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#8B0000",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
