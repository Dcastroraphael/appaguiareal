import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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

// DEFINIÇÃO DAS CATEGORIAS OFICIAIS DOS DESBRAVADORES
type CategoriaKey =
  | "adra"
  | "artes"
  | "agricolas"
  | "missionarias"
  | "profissionais"
  | "recreativas"
  | "saude"
  | "natureza"
  | "domesticas";

const CATEGORIAS: Record<
  CategoriaKey,
  { cor: string; icone: any; label: string; lib: any }
> = {
  adra: {
    cor: "#6d3686",
    icone: "hand-holding-heart",
    label: "ADRA",
    lib: FontAwesome5,
  },
  artes: {
    cor: "#093dda",
    icone: "brush",
    label: "Artes",
    lib: Ionicons,
  },
  agricolas: {
    cor: "#5e391e",
    icone: "seedling",
    label: "Agrícolas",
    lib: FontAwesome5,
  },
  missionarias: {
    cor: "#0004ff",
    icone: "bible",
    label: "Missionárias",
    lib: MaterialCommunityIcons,
  },
  profissionais: {
    cor: "#c50e0e",
    icone: "briefcase",
    label: "Profissionais",
    lib: Ionicons,
  },
  recreativas: {
    cor: "#09ff00",
    icone: "runfast",
    label: "Recreativas",
    lib: MaterialCommunityIcons,
  },
  saude: {
    cor: "#6511c5",
    icone: "medical-bag",
    label: "Saúde",
    lib: MaterialCommunityIcons,
  },
  natureza: {
    cor: "#3a3d3a",
    icone: "leaf",
    label: "Natureza",
    lib: FontAwesome5,
  },
  domesticas: {
    cor: "#d8910d",
    icone: "home",
    label: "Domésticas",
    lib: Ionicons,
  },
};

export default function EspecialidadesScreen() {
  const {
    especialidades = [],
    addEspecialidade,
    removerEspecialidade,
  } = useProgress();
  const [novoNome, setNovoNome] = useState("");
  const [catSelecionada, setCatSelecionada] =
    useState<CategoriaKey>("natureza");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const nomeLimpo = novoNome.trim();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado.");
      return;
    }

    if (!nomeLimpo) {
      Alert.alert("Campo vazio", "Digite o nome da especialidade.");
      return;
    }

    const existe = especialidades.some(
      (e) => e.nome.toLowerCase() === nomeLimpo.toLowerCase(),
    );

    if (existe) {
      Alert.alert("Já existe", "Essa especialidade já está na sua lista.");
      return;
    }

    try {
      setLoading(true);
      await addEspecialidade({
        nome: nomeLimpo,
        categoria: catSelecionada,
        userId: user.uid,
        dataConclusao: new Date().toISOString(),
      });
      setNovoNome("");
      Keyboard.dismiss();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemover = (item: any) => {
    const executarRemocao = async () => {
      try {
        await removerEspecialidade(item.id || item.nome);
      } catch (error) {
        console.error(error);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Remover "${item.nome}"?`)) executarRemocao();
    } else {
      Alert.alert("Remover", `Deseja excluir "${item.nome}"?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: executarRemocao },
      ]);
    }
  };

  return (
    <ScreenWrapper titulo={`Minhas\nespecialidades`} showBackButton={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* CARD DE RESUMO */}
          <View style={styles.resumoCard}>
            <Ionicons name="trophy" size={32} color="#FFD700" />
            <Text style={styles.resumoCount}>{especialidades.length}</Text>
            <Text style={styles.resumoTexto}>Concluídas</Text>
          </View>

          {/* SEÇÃO DE ADICIONAR */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Nova Conquista</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Primeiros Socorros"
              placeholderTextColor="#999"
              value={novoNome}
              onChangeText={setNovoNome}
              autoCapitalize="words"
              editable={!loading}
            />

            <Text style={styles.catLabelTitle}>Selecione a Categoria:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {(Object.keys(CATEGORIAS) as CategoriaKey[]).map((key) => {
                const CatLib = CATEGORIAS[key].lib;
                const isSelected = catSelecionada === key;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setCatSelecionada(key)}
                    style={[
                      styles.catBtnCircle,
                      { backgroundColor: CATEGORIAS[key].cor },
                      isSelected && styles.catActiveCircle,
                    ]}
                  >
                    <CatLib
                      name={CATEGORIAS[key].icone}
                      size={22}
                      color="#fff"
                    />
                    {isSelected && (
                      <Text style={styles.activeLabelText}>
                        {CATEGORIAS[key].label}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              onPress={handleAdd}
              style={[styles.btnSalvar, loading && { opacity: 0.7 }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnSalvarText}>Salvar Especialidade</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* LISTAGEM */}
          <View style={styles.grid}>
            {especialidades.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="ribbon-outline" size={60} color="#DDD" />
                <Text style={styles.emptyText}>Nenhuma registrada.</Text>
              </View>
            ) : (
              especialidades.map((item, index) => {
                const catInfo =
                  CATEGORIAS[item.categoria as CategoriaKey] ||
                  CATEGORIAS.natureza;
                const IconLib = catInfo.lib;
                return (
                  <View
                    key={item.id || index}
                    style={[styles.itemCard, { borderLeftColor: catInfo.cor }]}
                  >
                    <View
                      style={[
                        styles.iconIndicator,
                        { backgroundColor: catInfo.cor + "20" },
                      ]}
                    >
                      <IconLib
                        name={catInfo.icone}
                        size={18}
                        color={catInfo.cor}
                      />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemText}>{item.nome}</Text>
                      <Text
                        style={[styles.itemSubtext, { color: catInfo.cor }]}
                      >
                        {catInfo.label}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemover(item)}
                      style={styles.trashBtn}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FF4444"
                      />
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 60, alignItems: "center" },
  resumoCard: {
    backgroundColor: "#fff",
    width: "85%",
    marginTop: -30,
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  resumoCount: { fontSize: 32, fontWeight: "bold", color: "#8B0000" },
  resumoTexto: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  inputSection: { width: "100%", paddingHorizontal: 25, marginTop: 30 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  catLabelTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
    marginBottom: 10,
  },
  categoriesScroll: { gap: 10, paddingRight: 20 },
  catBtnCircle: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    gap: 8,
    opacity: 0.6,
  },
  catActiveCircle: {
    opacity: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
  },
  activeLabelText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  btnSalvar: {
    backgroundColor: "#8B0000",
    marginTop: 25,
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
  },
  btnSalvarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  grid: { width: "100%", paddingHorizontal: 25, marginTop: 30 },
  itemCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  iconIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemInfo: { flex: 1 },
  itemText: { fontWeight: "bold", fontSize: 15, color: "#333" },
  itemSubtext: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 2,
  },
  trashBtn: { padding: 8 },
  emptyBox: { alignItems: "center", marginTop: 20 },
  emptyText: { color: "#BBB", fontWeight: "600", marginTop: 10 },
});
