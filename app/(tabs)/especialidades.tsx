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
  { cor: string; icone: string; label: string; lib: any }
> = {
  adra: {
    cor: "#6d3686",
    icone: "hand-holding-heart",
    label: "ADRA",
    lib: FontAwesome5,
  },
  artes: { cor: "#093dda", icone: "brush", label: "Artes", lib: Ionicons },
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
    icone: "run-fast",
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
  const { especialidades, addEspecialidade, removerEspecialidade } =
    useProgress();
  const [novoNome, setNovoNome] = useState("");
  const [catSelecionada, setCatSelecionada] =
    useState<CategoriaKey>("natureza");
  const [loading, setLoading] = useState(false);

  const listaEspecialidades = especialidades || [];

  const handleAdd = async () => {
    const nomeLimpo = novoNome.trim();
    const user = auth.currentUser;

    if (!user || !nomeLimpo) {
      return Alert.alert("Ops!", "Digite o nome da especialidade.");
    }

    const jaExiste = listaEspecialidades.find(
      (e: any) => e.nome.toLowerCase() === nomeLimpo.toLowerCase(),
    );

    if (jaExiste) {
      return Alert.alert("Atenção", "Você já adicionou esta especialidade.");
    }

    try {
      setLoading(true);
      await addEspecialidade(nomeLimpo, catSelecionada);
      setNovoNome("");
      Keyboard.dismiss();
      Alert.alert("Sucesso!", "Especialidade adicionada!");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  const confirmRemover = (item: any) => {
    Alert.alert("Remover", `Deseja remover "${item.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim, Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await removerEspecialidade(item.id);
          } catch (e) {
            Alert.alert("Erro", "Falha ao remover.");
          }
        },
      },
    ]);
  };

  return (
    <ScreenWrapper titulo={`Minhas\nespecialidades`}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resumoCard}>
          <Ionicons name="ribbon" size={32} color="#FFD700" />
          <Text style={styles.resumoCount}>{listaEspecialidades.length}</Text>
          <Text style={styles.resumoTexto}>CONQUISTADAS</Text>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Ex: Felinos"
            placeholderTextColor="#999"
            value={novoNome}
            onChangeText={setNovoNome}
          />
          <Text style={styles.catLabelTitle}>CATEGORIA</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catScroll}
          >
            {(Object.keys(CATEGORIAS) as CategoriaKey[]).map((key) => (
              <TouchableOpacity
                key={key}
                onPress={() => setCatSelecionada(key)}
                style={[
                  styles.catBtnCircle,
                  { backgroundColor: CATEGORIAS[key].cor },
                  catSelecionada === key && styles.catActiveCircle,
                ]}
              >
                {React.createElement(CATEGORIAS[key].lib, {
                  name: CATEGORIAS[key].icone,
                  size: 20,
                  color: "#fff",
                })}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={handleAdd}
            style={styles.btnSalvar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnSalvarText}>ADICIONAR</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {listaEspecialidades.map((item: any, index: number) => {
            const cat =
              CATEGORIAS[item.categoria as CategoriaKey] || CATEGORIAS.natureza;
            return (
              <View
                key={item.id || index.toString()}
                style={[styles.itemCard, { borderLeftColor: cat.cor }]}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemText}>{item.nome}</Text>
                  <Text style={[styles.catTag, { color: cat.cor }]}>
                    {cat.label.toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => confirmRemover(item)}
                  style={styles.btnDelete}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF4444" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40, alignItems: "center" },
  resumoCard: {
    backgroundColor: "#fff",
    width: "85%",
    marginTop: -30,
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  resumoCount: { fontSize: 36, fontWeight: "bold", color: "#8B0000" },
  resumoTexto: {
    fontSize: 10,
    color: "#999",
    fontWeight: "bold",
    marginTop: 5,
  },
  inputSection: { width: "100%", paddingHorizontal: 25, marginTop: 30 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EEE",
    color: "#333",
  },
  catLabelTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#BBB",
    marginTop: 20,
    marginBottom: 10,
  },
  catScroll: { gap: 12, paddingBottom: 5 },
  catBtnCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.35,
  },
  catActiveCircle: {
    opacity: 1,
    borderWidth: 3,
    borderColor: "#FFF",
    elevation: 4,
  },
  btnSalvar: {
    backgroundColor: "#8B0000",
    marginTop: 25,
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  btnSalvarText: { color: "#fff", fontWeight: "bold" },
  grid: { width: "100%", paddingHorizontal: 25, marginTop: 25 },
  itemCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 6,
    elevation: 2,
  },
  itemInfo: { flex: 1 },
  itemText: { fontWeight: "bold", color: "#333", fontSize: 16 },
  catTag: { fontSize: 10, fontWeight: "800", marginTop: 4 },
  btnDelete: { padding: 8 },
});
