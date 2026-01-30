import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/firebase";

import { ScreenWrapper } from "../../components/ScreenWrapper";

interface Membro {
  id: string;
  nome: string;
  cargo: string;
  telefone: string;
  unidade: string;
}

export default function MembrosUnidadeScreen() {
  const { unidadeNome } = useLocalSearchParams<{ unidadeNome: string }>();
  const router = useRouter();

  const [membros, setMembros] = useState<Membro[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!unidadeNome) return;

    const q = query(
      collection(db, "usuarios"),
      where("unidade", "==", unidadeNome),
      orderBy("nome", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: Membro[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Membro,
      );

      setMembros(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [unidadeNome]);

  const membrosFiltrados = useMemo(() => {
    return membros.filter((m) =>
      (m.nome || "").toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca, membros]);

  const abrirWhatsApp = (telefone: string) => {
    if (!telefone) return;
    const num = telefone.replace(/\D/g, "");
    const finalNum = num.length <= 11 ? `55${num}` : num;
    const url = `https://wa.me/${finalNum}`;

    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      Linking.openURL(url).catch(() => {
        Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
      });
    }
  };

  const fazerLigacao = (telefone: string) => {
    if (!telefone) return;
    Linking.openURL(`tel:${telefone.replace(/\D/g, "")}`);
  };

  const getCargoStyle = (cargo: string): TextStyle => {
    const c = (cargo || "").toLowerCase();
    if (c.includes("conselheiro") || c.includes("diretor"))
      return { color: "#D32F2F", fontWeight: "bold" };
    if (c.includes("capitão")) return { color: "#1976D2", fontWeight: "bold" };
    return { color: "#666" };
  };

  return (
    <ScreenWrapper titulo={`Unidade ${unidadeNome}`} showBackButton={true}>
      <View style={styles.container}>
        <View style={styles.topActions}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#999" />
            <TextInput
              placeholder="Buscar desbravador..."
              style={styles.input}
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          <TouchableOpacity
            style={styles.chamadaBtn}
            onPress={() =>
              router.push({
                pathname: "/(admin)/chamada",
                params: { unidadeNome },
              } as any)
            }
          >
            <Ionicons name="checkbox-outline" size={20} color="#fff" />
            <Text style={styles.chamadaBtnText}>CHAMADA</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#8B0000"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={membrosFiltrados}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPadding}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.membroInfo}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarLetter}>
                      {(item.nome || "?").charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.textosMembro}>
                    <Text style={styles.nomeText} numberOfLines={1}>
                      {item.nome}
                    </Text>
                    <Text
                      style={[
                        styles.cargoText,
                        getCargoStyle(item.cargo || ""),
                      ]}
                    >
                      {item.cargo || "Membro"}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionsContainer}>
                  {item.telefone && (
                    <>
                      <TouchableOpacity
                        onPress={() => fazerLigacao(item.telefone)}
                        style={styles.iconBtn}
                      >
                        <Ionicons name="call" size={20} color="#444" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => abrirWhatsApp(item.telefone)}
                        style={[styles.iconBtn, styles.whatsappCircle]}
                      >
                        <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  topActions: { padding: 16, flexDirection: "row", gap: 10 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16 },
  chamadaBtn: {
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  chamadaBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  membroInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  textosMembro: { flex: 1 },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarLetter: { fontWeight: "bold", color: "#8B0000", fontSize: 18 },
  nomeText: { fontSize: 16, fontWeight: "700", color: "#222" },
  cargoText: { fontSize: 12 },
  actionsContainer: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  whatsappCircle: { backgroundColor: "#25D366" },
  listPadding: { padding: 16 },
});
