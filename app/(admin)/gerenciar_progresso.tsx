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
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";

// Definição da interface para os dados do Firestore
interface RequisitoAprovado {
  id: string;
  requisitoId: string;
  dataVisto: any;
  vistoPorNome: string;
  status: string;
}

const { width } = Dimensions.get("window");
const MAX_CONTENT_WIDTH = 800;

export default function VistosClassesScreen() {
  const { user } = useAuth();
  const [aprovados, setAprovados] = useState<RequisitoAprovado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Criamos a query para buscar apenas o progresso do usuário logado que foi APROVADO
    const q = query(
      collection(db, "progresso"),
      where("userId", "==", user.uid),
      where("status", "==", "aprovado"),
    );

    // O onSnapshot garante que a tela atualize sozinha assim que a diretoria validar
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RequisitoAprovado[];

        // Ordenação manual para garantir que os vistos mais recentes fiquem no topo
        const listaOrdenada = lista.sort((a, b) => {
          const tempoA = a.dataVisto?.seconds || 0;
          const tempoB = b.dataVisto?.seconds || 0;
          return tempoB - tempoA;
        });

        setAprovados(listaOrdenada);
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
        {/* Ícone de medalha representando a conquista */}
        <Ionicons name="ribbon-outline" size={28} color="#D4AF37" />
      </View>

      <View style={styles.content}>
        <Text style={styles.reqTitle}>Requisito: {item.requisitoId}</Text>
        <Text style={styles.footerText}>
          Validado por:{" "}
          <Text style={styles.bold}>{item.vistoPorNome || "Diretoria"}</Text>
        </Text>
      </View>

      <View style={styles.statusBadge}>
        {/* Check verde confirmando a aprovação */}
        <Ionicons name="checkmark-circle" size={26} color="#2E7D32" />
      </View>
    </View>
  );

  return (
    <ScreenWrapper titulo="Meus Vistos">
      <View style={styles.mainContainer}>
        {/* Cabeçalho com resumo de progresso */}
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
            <Text style={styles.loadingText}>Sincronizando conquistas...</Text>
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
                <Ionicons name="medal-outline" size={80} color="#EEE" />
                <Text style={styles.emptyTextTitle}>Nenhum visto oficial</Text>
                <Text style={styles.emptyTextSub}>
                  Seus requisitos aprovados pela diretoria aparecerão aqui como
                  medalhas de honra.
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
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  listContent: {
    width: width > MAX_CONTENT_WIDTH ? MAX_CONTENT_WIDTH : width,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
  },
  cardVisto: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#FFF9E6",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  reqTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  footerText: {
    fontSize: 13,
    color: "#777",
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
    marginTop: 12,
    color: "#8B0000",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
    paddingHorizontal: 50,
  },
  emptyTextTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#BBB",
    marginTop: 15,
  },
  emptyTextSub: {
    textAlign: "center",
    color: "#AAA",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
});
