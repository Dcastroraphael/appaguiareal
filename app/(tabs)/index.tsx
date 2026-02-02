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

  // Lógica de Diretoria robusta
  const isDiretoria =
    usuario?.cargo === "Diretor" ||
    usuario?.cargo === "Conselheiro" ||
    usuario?.cargo === "Diretoria" ||
    usuario?.cargo === "Instrutor";

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
        Alert.alert("Erro", "Não foi possível remover o aviso.");
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Deseja remover este aviso?"))
        await executarExclusao();
    } else {
      Alert.alert("Excluir", "Deseja remover este aviso permanentemente?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: executarExclusao },
      ]);
    }
  };

  return (
    <ScreenWrapper
      titulo={`Olá, ${usuario?.nome?.split(" ")[0] || "Líder"}!`}
      showBackButton={false}
    >
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
              onPress={() => router.push("/perfil" as any)}
              style={styles.profileButton}
              activeOpacity={0.7}
            >
              {usuario?.fotoUrl ? (
                <Image
                  source={{ uri: usuario.fotoUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={24} color="#8B0000" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* GESTÃO ADMINISTRATIVA */}
          {isDiretoria && (
            <View style={styles.sectionMargin}>
              <Text style={styles.sectionTitle}>Gestão Administrativa</Text>
              <View style={styles.adminGrid}>
                <TouchableOpacity
                  style={styles.adminButton}
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
            </View>
          )}

          {/* QUADRO DE AVISOS */}
          <View style={styles.sectionMargin}>
            <Text style={styles.sectionTitle}>Quadro de Avisos</Text>

            {avisos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="notifications-off-outline"
                  size={40}
                  color="#CCC"
                />
                <Text style={styles.emptyText}>Nenhum aviso no momento.</Text>
              </View>
            ) : (
              avisos.map((aviso) => (
                <View key={aviso.id} style={styles.noticeBox}>
                  <View style={styles.noticeHeader}>
                    <Text style={styles.noticeTitle}>{aviso.titulo}</Text>
                    {isDiretoria && (
                      <TouchableOpacity
                        onPress={() => handleExcluirAviso(aviso.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#FF4444"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.noticeContent}>{aviso.texto}</Text>
                  <Text style={styles.noticeDate}>{aviso.dataExibicao}</Text>
                </View>
              ))
            )}
          </View>
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
    marginTop: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#DDD",
    fontWeight: "600",
    opacity: 0.9,
  },
  profileButton: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#8B0000",
  },
  sectionMargin: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#BBB", // Cinza claro elegante
    marginBottom: 15,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  adminGrid: { flexDirection: "row", gap: 12 },
  adminButton: {
    flex: 1,
    backgroundColor: "#8B0000",
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 3,
  },
  adminButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  noticeBox: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 8,
    borderLeftColor: "#8B0000",
    elevation: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noticeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  noticeTitle: { fontSize: 18, fontWeight: "800", color: "#8B0000", flex: 0.9 },
  noticeContent: { fontSize: 15, color: "#444", lineHeight: 22 },
  noticeDate: {
    fontSize: 11,
    color: "#AAA",
    marginTop: 15,
    textAlign: "right",
    fontStyle: "italic",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    opacity: 0.6,
  },
  emptyText: {
    textAlign: "center",
    color: "#CCC",
    marginTop: 10,
    fontSize: 16,
  },
});
