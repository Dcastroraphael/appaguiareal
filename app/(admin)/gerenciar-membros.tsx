import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/firebase";

// Padronização Águia Real
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { Button } from "../../components/buttons";

interface Membro {
  id: string;
  nome: string;
  unidade: string;
  cargo: string;
  email: string;
}

const { width } = Dimensions.get("window");
const IS_WEB = Platform.OS === "web";
const MAX_WIDTH = 800;

// Opções pré-definidas para evitar erros de consistência no banco
const OPCOES_UNIDADES = [
  "Andorinha",
  "Arara",
  "Beija-flor",
  "Falcão",
  "Gaivota",
  "Gavião",
  "Harpia",
  "Pardal",
  "Rouxinol",
  "Diretoria",
];
const OPCOES_CARGOS = [
  "Desbravador",
  "Capitão",
  "Secretário",
  "Conselheiro",
  "Instrutor",
  "Diretor",
  "Tesoureiro",
];

export default function GerenciarMembros() {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [membrosFiltrados, setMembrosFiltrados] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState("");

  const [modalVisivel, setModalVisivel] = useState(false);
  const [membroSelecionado, setMembroSelecionado] = useState<Membro | null>(
    null,
  );
  const [editUnidade, setEditUnidade] = useState("");
  const [editCargo, setEditCargo] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "usuarios"), orderBy("nome", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lista: Membro[] = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() } as Membro);
      });
      setMembros(lista);
      setMembrosFiltrados(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const resultado = membros.filter(
      (m) =>
        m.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        m.unidade?.toLowerCase().includes(pesquisa.toLowerCase()),
    );
    setMembrosFiltrados(resultado);
  }, [pesquisa, membros]);

  const abrirEdicao = (membro: Membro) => {
    setMembroSelecionado(membro);
    setEditUnidade(membro.unidade || "");
    setEditCargo(membro.cargo || "");
    setModalVisivel(true);
  };

  const salvarAlteracoes = async () => {
    if (!membroSelecionado) return;
    setSalvando(true);
    try {
      const userRef = doc(db, "usuarios", membroSelecionado.id);
      await updateDoc(userRef, {
        unidade: editUnidade,
        cargo: editCargo,
      });
      setModalVisivel(false);
      // No Web, o Alert.alert funciona como o window.confirm/alert padrão
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar membro.");
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

  return (
    <ScreenWrapper titulo="Gerenciar Membros" showBackButton={true}>
      <View style={styles.mainContainer}>
        <View style={styles.responsiveWrapper}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Buscar por nome ou unidade..."
              value={pesquisa}
              onChangeText={setPesquisa}
            />
          </View>

          <FlatList
            data={membrosFiltrados}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => abrirEdicao(item)}
                activeOpacity={0.7}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.nome?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.memberName}>{item.nome}</Text>
                  <View style={styles.badgeRow}>
                    <Text style={styles.unitBadge}>
                      {item.unidade || "Sem Unidade"}
                    </Text>
                    <Text style={styles.roleText}>
                      {item.cargo || "Membro"}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum membro encontrado.</Text>
            }
          />
        </View>
      </View>

      {/* MODAL DE EDIÇÃO */}
      <Modal visible={modalVisivel} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajustar Cadastro</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalNome}>{membroSelecionado?.nome}</Text>

            <Text style={styles.label}>Unidade</Text>
            <View style={styles.pickerContainer}>
              {OPCOES_UNIDADES.map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[
                    styles.pickerItem,
                    editUnidade === u && styles.pickerItemActive,
                  ]}
                  onPress={() => setEditUnidade(u)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      editUnidade === u && styles.textWhite,
                    ]}
                  >
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Cargo</Text>
            <View style={styles.pickerContainer}>
              {OPCOES_CARGOS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.pickerItem,
                    editCargo === c && styles.pickerItemActive,
                  ]}
                  onPress={() => setEditCargo(c)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      editCargo === c && styles.textWhite,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="SALVAR ALTERAÇÕES"
                onPress={salvarAlteracoes}
                loading={salvando}
                style={{ backgroundColor: "#8B0000", height: 55 }}
              />
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.textCancelar}>VOLTAR SEM SALVAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, alignItems: "center" },
  responsiveWrapper: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    paddingHorizontal: 20,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginTop: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  listContent: { paddingVertical: 15, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      web: { boxShadow: "0px 2px 5px rgba(0,0,0,0.05)" },
    }),
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#FFDADA",
  },
  avatarText: { fontSize: 20, fontWeight: "bold", color: "#8B0000" },
  info: { flex: 1 },
  memberName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  unitBadge: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#8B0000",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  roleText: { fontSize: 12, color: "#666" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 24,
    width: "100%",
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  modalNome: {
    fontSize: 14,
    color: "#8B0000",
    marginBottom: 20,
    fontWeight: "600",
  },
  label: { fontWeight: "bold", marginBottom: 10, color: "#333", fontSize: 14 },

  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  pickerItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#F9F9F9",
  },
  pickerItemActive: { backgroundColor: "#8B0000", borderColor: "#8B0000" },
  pickerItemText: { fontSize: 12, color: "#666", fontWeight: "600" },
  textWhite: { color: "#FFF" },

  modalButtons: { marginTop: 10 },
  btnCancelar: { padding: 15, alignItems: "center", marginTop: 5 },
  textCancelar: { color: "#999", fontWeight: "bold", fontSize: 13 },
  emptyText: { textAlign: "center", marginTop: 40, color: "#999" },
});
