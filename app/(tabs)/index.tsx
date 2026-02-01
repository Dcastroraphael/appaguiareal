import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
    usuario?.cargo === "Diretor" ||
    usuario?.cargo === "Conselheiro" ||
    usuario?.cargo === "Diretoria";

  useEffect(() => {
    const q = query(collection(db, "avisos"), orderBy("dataCriacao", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs: any[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setAvisos(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleExcluirAviso = async (id: string) => {
    const executarExclusao = async () => {
      try {
        await deleteDoc(doc(db, "avisos", id));
      } catch (error) {
        console.error("Erro ao excluir:", error);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Deseja remover este aviso?"))
        await executarExclusao();
    } else {
      Alert.alert("Excluir", "Remover este aviso?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: executarExclusao },
      ]);
    }
  };

  return (
    <ScreenWrapper titulo={`Olá, ${usuario?.nome?.split(" ")[0] || "Líder"}!`}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.responsiveContainer}>
          {/* CABEÇALHO COM PERFIL */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcomeSubtitle}>Clube Águia Real</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/perfil")}
              style={styles.profileButton}
            >
              {/* @ts-ignore - Resolvendo o erro 'fotoUrl does not exist' da imagem da0734 */}
              {usuario?.fotoUrl ? (
                // @ts-ignore
                <Image
                  source={{ uri: usuario.fotoUrl }}
                  style={styles.avatar}
                />
              ) : (
                <Ionicons name="person-circle" size={48} color="#8B0000" />
              )}
            </TouchableOpacity>
          </View>

          {/* GESTÃO (SÓ DIRETORIA) */}
          {isDiretoria && (
            <>
              <Text style={styles.sectionTitle}>Gestão Administrativa</Text>
              <View style={styles.adminGrid}>
                <TouchableOpacity
                  style={styles.adminButton}
                  /* Corrigindo a rota de admin conforme imagem 26a276 */
                  onPress={() => router.push("/(admin)/novo_aviso" as any)}
                >
                  <Ionicons name="megaphone" size={20} color="#FFF" />
                  <Text style={styles.adminButtonText}>Novo Aviso</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.adminButton, { backgroundColor: "#2E7D32" }]}
                  onPress={() => router.push("/(admin)/novo_evento" as any)}
                >
                  <Ionicons name="calendar" size={20} color="#FFF" />
                  <Text style={styles.adminButtonText}>Novo Evento</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* QUADRO DE AVISOS */}
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Quadro de Avisos</Text>
          </View>

          {avisos.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum aviso no momento.</Text>
          ) : (
            avisos.map((aviso) => (
              <View key={aviso.id} style={styles.noticeBox}>
                <View style={styles.noticeHeader}>
                  <Text style={styles.noticeTitle}>{aviso.titulo}</Text>
                  {isDiretoria && (
                    <TouchableOpacity
                      onPress={() => handleExcluirAviso(aviso.id)}
                    >
                      <Ionicons name="close-circle" size={20} color="#CCC" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.noticeContent}>{aviso.texto}</Text>
                <Text style={styles.noticeDate}>{aviso.dataExibicao}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40, alignItems: "center" },
  responsiveContainer: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  welcomeSubtitle: { fontSize: 14, color: "#666" },
  profileButton: { padding: 5 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#8B0000",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 15,
  },
  adminGrid: { flexDirection: "row", gap: 10, marginBottom: 10 },
  adminButton: {
    flex: 1,
    backgroundColor: "#8B0000",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  adminButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  noticeBox: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    borderLeftWidth: 6,
    borderLeftColor: "#8B0000",
    elevation: 3,
    marginBottom: 15,
  },
  noticeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  noticeTitle: { fontSize: 16, fontWeight: "800", color: "#8B0000" },
  noticeContent: { fontSize: 14, color: "#444" },
  noticeDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 12,
    textAlign: "right",
  },
  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
});
