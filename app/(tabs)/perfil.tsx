import { Ionicons } from "@expo/vector-icons";
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
import { useUsuario } from "../../context/UsuarioContext"; // Seu contexto de usuário

// LISTA DE UNIDADES EM ORDEM ALFABÉTICA
const UNIDADES_OFICIAIS = [
  "Andorinha",
  "Arara",
  "Beija-flor",
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

  // Estados locais para edição
  const [nome, setNome] = useState(usuario?.nome || "");
  const [unidade, setUnidade] = useState(usuario?.unidade || "");
  const [cargo, setCargo] = useState(usuario?.cargo || "");

  const handleSalvar = async () => {
    if (!auth.currentUser) return;

    // Validação básica
    if (!unidade) {
      return Alert.alert("Erro", "Por favor, selecione sua unidade.");
    }

    setLoading(true);
    try {
      const userRef = doc(db, "usuarios", auth.currentUser.uid);

      const dadosParaAtualizar = {
        nome: nome.trim(),
        unidade: unidade,
        cargo: cargo.trim(),
        ultimaAtualizacao: serverTimestamp(),
      };

      await updateDoc(userRef, dadosParaAtualizar);

      // Atualiza o contexto global para refletir na hora em todas as telas
      atualizarDados(dadosParaAtualizar);

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper titulo="Editar Perfil">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* NOME COMPLETO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>NOME COMPLETO</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
          />
        </View>

        {/* UNIDADE (SELEÇÃO PADRONIZADA) */}
        <Text style={styles.label}>MINHA UNIDADE</Text>
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

        {/* CARGO (TEXTO LIVRE) */}
        <View style={[styles.inputGroup, { marginTop: 10 }]}>
          <Text style={styles.label}>MEU CARGO</Text>
          <TextInput
            style={styles.input}
            value={cargo}
            onChangeText={setCargo}
            placeholder="Ex: Diretor, Conselheiro, Desbravador..."
          />
        </View>

        {/* BOTÃO SALVAR */}
        <TouchableOpacity
          style={[styles.btnSalvar, loading && { opacity: 0.7 }]}
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#FFF"
              />
              <Text style={styles.btnText}>SALVAR ALTERAÇÕES</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, paddingBottom: 40 },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#8B0000", // Cor bordô para combinar com o clube
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  unidadesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  chipActive: {
    backgroundColor: "#8B0000",
    borderColor: "#8B0000",
  },
  chipText: { color: "#666", fontSize: 14 },
  chipTextActive: { color: "#FFF", fontWeight: "bold" },
  btnSalvar: {
    backgroundColor: "#1B5E20", // Verde escuro para confirmar
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 10,
    marginTop: 20,
    elevation: 2,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
