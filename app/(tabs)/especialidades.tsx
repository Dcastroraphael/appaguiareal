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
  View
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

  const handleAdd = async () => {
    const nomeLimpo = novoNome.trim();
    const user = auth.currentUser;
    if (!user || !nomeLimpo)
      return Alert.alert("Erro", "Preencha o nome da especialidade.");

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
      Alert.alert("Sucesso", "Especialidade cadastrada!");
    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar no banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper titulo={`Minhas\nespecialidades`}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.resumoCard}>
          <Ionicons name="trophy" size={32} color="#FFD700" />
          <Text style={styles.resumoCount}>{especialidades.length}</Text>
          <Text style={styles.resumoTexto}>Concluídas</Text>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Ex: Primeiros Socorros"
            value={novoNome}
            onChangeText={setNovoNome}
          />
          <Text style={styles.catLabelTitle}>Categoria:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
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
              <Text style={styles.btnSalvarText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {especialidades.map((item) => {
            const cat =
              CATEGORIAS[item.categoria as CategoriaKey] || CATEGORIAS.natureza;
            return (
              <View
                key={item.id}
                style={[styles.itemCard, { borderLeftColor: cat.cor }]}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemText}>{item.nome}</Text>
                  <Text style={{ color: cat.cor, fontSize: 11 }}>
                    {cat.label}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removerEspecialidade(item.nome)}
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
    elevation: 10,
  },
  resumoCount: { fontSize: 32, fontWeight: "bold", color: "#8B0000" },
  resumoTexto: { fontSize: 12, color: "#666", fontWeight: "bold" },
  inputSection: { width: "100%", paddingHorizontal: 25, marginTop: 30 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  catLabelTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginVertical: 10,
  },
  catBtnCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  catActiveCircle: { opacity: 1, borderWidth: 2, borderColor: "#000" },
  btnSalvar: {
    backgroundColor: "#8B0000",
    marginTop: 20,
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  btnSalvarText: { color: "#fff", fontWeight: "bold" },
  grid: { width: "100%", paddingHorizontal: 25, marginTop: 20 },
  itemCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 6,
    elevation: 2,
  },
  itemInfo: { flex: 1 },
  itemText: { fontWeight: "bold", color: "#333" },
});
