import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { useUsuario } from "../../context/UsuarioContext";

const { width } = Dimensions.get("window");
const IS_WEB = Platform.OS === "web";
const MAX_WIDTH = 800; // Largura máxima para monitores de PC

export default function HomeScreen() {
  const router = useRouter();
  const { usuario } = useUsuario();

  // Função para renderizar os cards de atalho
  const MenuButton = ({ title, icon, route, color }: any) => (
    <TouchableOpacity
      style={[styles.menuCard, { borderLeftColor: color }]}
      onPress={() => router.push(route)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper
      titulo={`Olá, ${usuario?.nome?.split(" ")[0] || "Desbravador"}!`}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Container Responsivo Centralizado */}
        <View style={styles.responsiveContainer}>
          {/* CARD DE RESUMO DE PERFIL */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => router.push("/perfil")}
          >
            <View style={styles.profileInfo}>
              <Text style={styles.clubName}>Clube de Desbravadores</Text>
              <Text style={styles.userName}>{usuario?.nome || "Membro"}</Text>
              <Text style={styles.userRole}>
                {usuario?.cargo || "Desbravador"} •{" "}
                {usuario?.unidade || "Sem Unidade"}
              </Text>
            </View>
            <View style={styles.avatarMini}>
              <Ionicons name="person-circle" size={50} color="#8B0000" />
            </View>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Acesso Rápido</Text>

          {/* GRID DE BOTÕES */}
          <View style={styles.menuGrid}>
            <MenuButton
              title="Minha Presença"
              icon="calendar-check"
              route="/presenca"
              color="#228B22"
            />
            <MenuButton
              title="Minhas Classes"
              icon="book"
              route="/classes"
              color="#4169E1"
            />
            <MenuButton
              title="Especialidades"
              icon="medal"
              route="/especialidades"
              color="#FFD700"
            />
            <MenuButton
              title="Agenda do Clube"
              icon="time"
              route="/calendario"
              color="#FF4500"
            />
          </View>

          {/* ÁREA DE AVISOS (Exemplo de conteúdo expansível) */}
          <View style={styles.noticeBox}>
            <View style={styles.noticeHeader}>
              <Ionicons name="megaphone" size={20} color="#8B0000" />
              <Text style={styles.noticeTitle}>Último Aviso</Text>
            </View>
            <Text style={styles.noticeContent}>
              Não esqueça do uniforme de gala para a reunião deste próximo
              domingo!
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
    alignItems: "center", // Centraliza o conteúdo no Web
  },
  responsiveContainer: {
    width: "100%",
    maxWidth: MAX_WIDTH, // No PC, o app não "esparrama"
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  profileInfo: { flex: 1 },
  clubName: {
    fontSize: 12,
    color: "#8B0000",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 2,
  },
  userRole: { fontSize: 14, color: "#666" },
  avatarMini: { marginLeft: 15 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 25,
    marginBottom: 15,
  },
  menuGrid: {
    gap: 12,
  },
  menuCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  noticeBox: {
    marginTop: 25,
    backgroundColor: "#FFF5F5",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#FFDADA",
  },
  noticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#8B0000",
  },
  noticeContent: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
