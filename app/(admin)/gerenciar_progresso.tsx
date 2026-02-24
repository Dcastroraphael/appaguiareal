import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";

interface RequisitoAprovado {
  id: string;
  requisitoId: string;
  dataVisto: any;
  vistoPorNome: string;
}

const { width } = Dimensions.get("window");
const MAX_CONTENT_WIDTH = 800;

export default function VistosClassesScreen() {
  const { user } = useAuth();
  const [aprovados, setAprovados] = useState<RequisitoAprovado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Escuta em tempo real os requisitos com status "aprovado"
    const q = query(
      collection(db, "progresso"),
      where("userId", "==", user.uid),
      where("status", "==", "aprovado"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RequisitoAprovado[];

        // Ordenação segura por data
        setAprovados(
          lista.sort((a, b) => {
            const dateA = a.dataVisto?.seconds || 0;
            const dateB = b.dataVisto?.seconds || 0;
            return dateB - dateA;
          }),
        );
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao carregar vistos:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const renderItem = ({ item }: { item: RequisitoAprovado }) => (
    <View style={styles.cardVisto}>
      <View style={styles.iconContainer}>
        {/* Ícone trocado para medalha (ribbon) que é mais comum */}
        <Ionicons name="ribbon-outline" size={28} color="#D4AF37" />
      </View>

      <View style={styles.content}>
        <Text style={styles.reqTitle}>Requisito: {item.requisitoId}</Text>
        <Text style={styles.footerText}>
          Assinado por:{" "}
          <Text style={styles.bold}>{item.vistoPorNome || "Diretoria"}</Text>
        </Text>
      </View>

      <View style={styles.statusBadge}>
        {/* Ícone corrigido aqui para evitar o erro de TypeScript */}
        <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
      </View>
    </View>
  );

  return (
    <ScreenWrapper titulo="Meus Vistos">
      <View style={styles.mainContainer}>
        <View style={styles.headerInfo}>
          <Text style={styles.summaryTitle}>Progresso Validado</Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {aprovados.length} Concluídos
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#8B0000" />
            <Text style={styles.loadingText}>Carregando conquistas...</Text>
          </View>
        ) : (
          <FlatList
            data={aprovados}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="shield-outline" size={80} color="#EEE" />
                <Text style={styles.emptyTextTitle}>Nenhum visto ainda</Text>
                <Text style={styles.emptyTextSub}>
                  Assim que a diretoria validar seus requisitos, eles aparecerão
                  aqui como medalhas!
                </Text>
              </View>
            }
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FDFDFD",
  },
  headerInfo: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
  },
  counterBadge: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  listContent: {
    width: width > MAX_CONTENT_WIDTH ? MAX_CONTENT_WIDTH : width,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
  },
  cardVisto: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    // Sombra leve
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: "#FFF9E6",
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  reqTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  footerText: {
    fontSize: 12,
    color: "#888",
  },
  bold: {
    fontWeight: "bold",
    color: "#8B0000",
  },
  statusBadge: {
    marginLeft: 10,
  },
  loadingArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyTextTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#CCC",
    marginTop: 15,
  },
  emptyTextSub: {
    textAlign: "center",
    color: "#AAA",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});
