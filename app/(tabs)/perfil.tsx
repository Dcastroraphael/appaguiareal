import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { auth, db } from "../../config/firebase";
import { useUsuario } from "../../context/UsuarioContext";

// LISTA DE UNIDADES ATUALIZADA (ORDEM ALFABÉTICA + DIRETORIA)
const UNIDADES_OFICIAIS = [
  "Andorinha",
  "Arara",
  "Beija-flor",
  "Diretoria", // Adicionada conforme solicitado
  "Falcão",
  "Gaivota",
  "Gavião",
  "Harpia",
  "Pardal",
  "Rouxinol",
];

export default function EditarPerfilScreen() {
  const { usuario, atualizarDados } = useUsuario();
  const [loading, setLoading] = useState(false);

  // ESTADOS PARA TODOS OS CAMPOS DE PERSONALIZAÇÃO
  const [nome, setNome] = useState(usuario?.nome || "");
  const [unidade, setUnidade] = useState(usuario?.unidade || "");
  const [cargo, setCargo] = useState(usuario?.cargo || "");
  const [tipoSanguineo, setTipoSanguineo] = useState(
    usuario?.tipoSanguineo || "",
  );
  const [telefone, setTelefone] = useState(usuario?.telefone || "");
  const [endereco, setEndereco] = useState(usuario?.endereco || "");

  const handleSalvar = async () => {
    if (!auth.currentUser) return;
    if (!unidade) return Alert.alert("Erro", "Selecione sua unidade.");

    setLoading(true);
    try {
      const userRef = doc(db, "usuarios", auth.currentUser.uid);

      const dadosParaAtualizar = {
        nome: nome.trim(),
        unidade: unidade,
        cargo: cargo.trim(),
        tipoSanguineo: tipoSanguineo.trim(),
        telefone: telefone.trim(),
        endereco: endereco.trim(),
        ultimaAtualizacao: serverTimestamp(),
      };

      await updateDoc(userRef, dadosParaAtualizar);
      atualizarDados(dadosParaAtualizar);

      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper titulo="Editar Perfil">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* DADOS PESSOAIS */}
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Tipo Sanguíneo</Text>
            <TextInput
              style={styles.input}
              value={tipoSanguineo}
              onChangeText={setTipoSanguineo}
              placeholder="Ex: A+"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 2 }]}>
            <Text style={styles.label}>Contato/Telefone</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Endereço</Text>
          <TextInput
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
          />
        </View>

        {/* IDENTIFICAÇÃO NO CLUBE */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>No Clube</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cargo (Identificação)</Text>
          <TextInput
            style={styles.input}
            value={cargo}
            onChangeText={setCargo}
            placeholder="Ex: Conselheiro, Desbravador..."
          />
        </View>

        <Text style={styles.label}>Unidade</Text>
        <View style={styles.unidadesGrid}>
          {UNIDADES_OFICIAIS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, unidade === item && styles.chipActive]}
              onPress={() => setUnidade(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  unidade === item && styles.chipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.btnSalvar}
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.btnText}>SALVAR PERFIL</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#8B0000",
    paddingLeft: 10,
  },
  inputGroup: { marginBottom: 15 },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  row: { flexDirection: "row" },
  unidadesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  chipActive: { backgroundColor: "#8B0000", borderColor: "#8B0000" },
  chipText: { color: "#666", fontSize: 13 },
  chipTextActive: { color: "#FFF", fontWeight: "bold" },
  btnSalvar: {
    backgroundColor: "#1B5E20",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
