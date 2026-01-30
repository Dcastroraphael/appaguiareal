import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { auth } from "../../config/firebase";
import { useProgress } from "../../hooks/useProgress";

type CategoriaKey = "natureza" | "artes" | "geral" | "habilidades";

const CATEGORIAS: Record<
  CategoriaKey,
  { cor: string; icone: string; label: string }
> = {
  natureza: { cor: "#228B22", icone: "leaf", label: "Natureza" },
  artes: { cor: "#4169E1", icone: "brush", label: "Artes" },
  geral: { cor: "#FFD700", icone: "ribbon", label: "Geral" },
  habilidades: { cor: "#FF4500", icone: "hammer", label: "Habilidades" },
};

export default function EspecialidadesScreen() {
  const {
    especialidades = [],
    addEspecialidade,
    removerEspecialidade,
  } = useProgress();

  const [novoNome, setNovoNome] = useState("");
  const [catSelecionada, setCatSelecionada] = useState<CategoriaKey>("geral");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const nomeLimpo = novoNome.trim();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado para cadastrar.");
      return;
    }

    if (!nomeLimpo) {
      Alert.alert("Campo vazio", "Como se chama a especialidade?");
      return;
    }

    const existe = especialidades.some(
      (e) => e.nome.toLowerCase() === nomeLimpo.toLowerCase(),
    );

    if (existe) {
      Alert.alert("Já existe", "Você já cadastrou essa especialidade.");
      return;
    }

    try {
      setLoading(true);
      // O segredo está em esperar o addEspecialidade terminar
      await addEspecialidade({
        nome: nomeLimpo,
        categoria: catSelecionada,
        userId: user.uid,
        dataConclusao: new Date().toISOString(), // Adicionei data para controle
      });

      setNovoNome("");
      Keyboard.dismiss();
      // Opcional: Feedback de sucesso
      // Alert.alert("Sucesso!", "Especialidade cadastrada.");
    } catch (error: any) {
      console.error(error);
      // EXIBE O ERRO REAL PARA DEBUG
      Alert.alert("Erro ao cadastrar", error.message || "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper titulo={`Minhas\nespecialidades`} showBackButton={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* CARD DE RESUMO */}
          <View style={styles.resumoCard}>
            <Ionicons
              name="trophy"
              size={30}
              color="#FFD700"
              style={{ marginBottom: 5 }}
            />
            <Text style={styles.resumoCount}>{especialidades.length}</Text>
            <Text style={styles.resumoTexto}>Concluídas</Text>
          </View>

          {/* SEÇÃO DE ADICIONAR */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Adicionar Nova</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Fogueiras e Cozinha ao Ar Livre"
              placeholderTextColor="#999"
              value={novoNome}
              onChangeText={setNovoNome}
              autoCapitalize="words"
              editable={!loading} // Trava o input enquanto salva
            />

            <View style={styles.selectorRow}>
              <View style={styles.categoriesContainer}>
                {(Object.keys(CATEGORIAS) as CategoriaKey[]).map((key) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setCatSelecionada(key)}
                    style={[
                      styles.catBtn,
                      { backgroundColor: CATEGORIAS[key].cor },
                      catSelecionada === key && styles.catActive,
                    ]}
                  >
                    <Ionicons
                      name={CATEGORIAS[key].icone as any}
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleAdd}
                style={[styles.addBtn, loading && { opacity: 0.7 }]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Ionicons name="add" size={35} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.catLabel}>
              Categoria: {CATEGORIAS[catSelecionada].label}
            </Text>
          </View>

          {/* LISTA */}
          <View style={styles.grid}>
            {especialidades.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="ribbon-outline" size={80} color="#EEE" />
                <Text style={styles.emptyText}>
                  Nenhuma especialidade registrada ainda.
                </Text>
              </View>
            ) : (
              especialidades.map((item, index) => (
                <View
                  key={item.id || index} // Use ID do Firestore se disponível
                  style={[
                    styles.itemCard,
                    {
                      borderLeftColor:
                        CATEGORIAS[item.categoria as CategoriaKey]?.cor ||
                        "#CCC",
                    },
                  ]}
                >
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemText}>{item.nome}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Remover",
                        "Deseja excluir esta especialidade?",
                        [
                          { text: "Cancelar", style: "cancel" },
                          {
                            text: "Excluir",
                            style: "destructive",
                            onPress: () => removerEspecialidade(item.nome),
                          },
                        ],
                      );
                    }}
                    style={styles.trashBtn}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 60 },
  resumoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 25,
    marginTop: -30,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  resumoCount: { fontSize: 28, fontWeight: "bold", color: "#8B0000" },
  resumoTexto: { fontSize: 14, color: "#666", fontWeight: "600" },
  inputSection: { paddingHorizontal: 25, marginTop: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  categoriesContainer: { flexDirection: "row", gap: 10 },
  catBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.4,
  },
  catActive: {
    opacity: 1,
    borderWidth: 3,
    borderColor: "#F0F0F0",
    transform: [{ scale: 1.1 }],
  },
  catLabel: { fontSize: 12, color: "#999", marginTop: 8, fontStyle: "italic" },
  addBtn: {
    backgroundColor: "#8B0000",
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  grid: { paddingHorizontal: 25, marginTop: 25 },
  itemCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 6,
    elevation: 2,
  },
  itemInfo: { flex: 1 },
  itemText: { fontWeight: "700", fontSize: 14, color: "#333" },
  trashBtn: { padding: 5 },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#999", fontWeight: "bold", marginTop: 10 },
});
