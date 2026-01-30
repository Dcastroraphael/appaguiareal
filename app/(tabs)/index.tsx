import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { useUsuario } from "../../context/UsuarioContext";

const MAX_WIDTH = 800;

export default function HomeScreen() {
  const router = useRouter();
  const { usuario } = useUsuario();

  const isDiretoria =
    usuario?.cargo === "Diretor" || usuario?.cargo === "Conselheiro";

  return (
    <ScreenWrapper titulo={`Olá, ${usuario?.nome?.split(" ")[0] || "Líder"}!`}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.responsiveContainer}>
          {/* CARD DE PERFIL */}
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <Text style={styles.clubName}>
                Clube de Desbravadores Águia Real
              </Text>
              <Text style={styles.userName}>{usuario?.nome || "Membro"}</Text>
              <Text style={styles.userRole}>
                {usuario?.cargo} • {usuario?.unidade}
              </Text>
            </View>
            <Ionicons name="person-circle" size={50} color="#8B0000" />
          </View>

          {/* ÁREA DE GESTÃO (SÓ DIRETORIA) */}
          {isDiretoria && (
            <>
              <Text style={styles.sectionTitle}>Gestão do Clube</Text>
              <View style={styles.adminGrid}>
                <TouchableOpacity
                  style={styles.adminButton}
                  onPress={() => router.push("/(admin)/gerenciar-membros")}
                >
                  <Ionicons name="people" size={24} color="#FFF" />
                  <Text style={styles.adminButtonText}>Gerenciar Membros</Text>
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

          {/* QUADRO DE AVISOS */}
          <Text style={styles.sectionTitle}>Quadro de Avisos</Text>
          <View style={styles.noticeBox}>
            <View style={styles.noticeHeader}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  flex: 1,
                }}
              >
                <Ionicons name="megaphone" size={20} color="#8B0000" />
                <Text style={styles.noticeTitle}>Uniforme de Gala</Text>
              </View>

              {/* Botão de Remover (Apenas Visual por enquanto) */}
              {isDiretoria && (
                <TouchableOpacity
                  onPress={() => alert("Função para excluir aviso")}
                >
                  <Ionicons name="trash-outline" size={18} color="#666" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.noticeContent}>
              Atenção: Reunião especial com uniforme de gala neste domingo às
              08:00.
            </Text>
            <Text style={styles.noticeDate}>Postado em: 30/01/2026</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 30, alignItems: "center" },
  responsiveContainer: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
  },
  profileInfo: { flex: 1 },
  clubName: {
    fontSize: 10,
    color: "#8B0000",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  userName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  userRole: { fontSize: 13, color: "#666" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 25,
    marginBottom: 15,
  },
  adminGrid: { flexDirection: "row", gap: 12 },
  adminButton: {
    flex: 1,
    backgroundColor: "#8B0000",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  adminButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
  },
  noticeBox: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#8B0000",
    elevation: 2,
  },
  noticeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  noticeTitle: { fontSize: 15, fontWeight: "700", color: "#333" },
  noticeContent: { fontSize: 14, color: "#555", lineHeight: 20 },
  noticeDate: { fontSize: 11, color: "#999", marginTop: 8, textAlign: "right" },
});
