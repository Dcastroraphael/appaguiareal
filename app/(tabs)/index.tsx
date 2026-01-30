import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { db } from "../../config/firebase";
import { useUsuario } from "../../context/UsuarioContext";

const MAX_WIDTH = 800;

export default function HomeScreen() {
  const router = useRouter();
  const { usuario } = useUsuario();
  const [avisos, setAvisos] = useState<any[]>([]);

  const isDiretoria =
    usuario?.cargo === "Diretor" || usuario?.cargo === "Conselheiro";

  // Busca avisos em tempo real
  useEffect(() => {
    const q = query(collection(db, "eventos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs: any[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setAvisos(docs);
    });
    return () => unsubscribe();
  }, []);

  // FUNÇÃO DE EXCLUSÃO COMPATÍVEL COM WEB E MOBILE
  const handleExcluirEvento = async (id: string) => {
    const executarExclusao = async () => {
      try {
        await deleteDoc(doc(db, "eventos", id));
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o evento.");
      }
    };

    if (Platform.OS === "web") {
      const confirmacao = window.confirm(
        "Tem certeza que deseja remover este aviso permanentemente?",
      );
      if (confirmacao) await executarExclusao();
    } else {
      Alert.alert(
        "Excluir Evento",
        "Tem certeza que deseja remover este aviso permanentemente?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: executarExclusao },
        ],
      );
    }
  };

  return (
    <ScreenWrapper titulo={`Olá, ${usuario?.nome?.split(" ")[0] || "Líder"}!`}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.responsiveContainer}>
          {/* GESTÃO (SÓ DIRETORIA) */}
          {isDiretoria && (
            <>
              <Text style={styles.sectionTitle}>Gestão do Clube</Text>
              <View style={styles.adminGrid}>
                <TouchableOpacity
                  style={styles.adminButton}
                  onPress={() => router.push("/(admin)/gerenciar-membros")}
                >
                  <Ionicons name="people" size={24} color="#FFF" />
                  <Text style={styles.adminButtonText}>Membros</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.adminButton, { backgroundColor: "#228B22" }]}
                  onPress={() => router.push("/(admin)/novo_evento")}
                >
                  <Ionicons name="calendar-outline" size={24} color="#FFF" />
                  <Text style={styles.adminButtonText}>Novo Evento</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>Quadro de Avisos</Text>

          {avisos.length === 0 && (
            <Text style={styles.emptyText}>Nenhum aviso no momento.</Text>
          )}

          {avisos.map((aviso) => (
            <View key={aviso.id} style={styles.noticeBox}>
              <View style={styles.noticeHeader}>
                <Text style={styles.noticeTitle}>
                  {aviso.titulo || "Aviso"}
                </Text>
                {isDiretoria && (
                  <TouchableOpacity
                    onPress={() => handleExcluirEvento(aviso.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#8B0000" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.noticeContent}>
                {aviso.descricao || aviso.texto}
              </Text>
              <Text style={styles.noticeDate}>{aviso.data}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
    alignItems: "center",
  },
  responsiveContainer: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 25,
    marginBottom: 15,
  },
  adminGrid: {
    flexDirection: "row",
    gap: 12,
  },
  adminButton: {
    flex: 1,
    backgroundColor: "#8B0000",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  adminButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 14,
  },
  noticeBox: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#8B0000",
    elevation: 2,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  noticeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  noticeContent: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  noticeDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 10,
    textAlign: "right",
  },
});
