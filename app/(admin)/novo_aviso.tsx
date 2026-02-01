import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
import { db } from "../../config/firebase";

export default function NovoAvisoScreen() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [dataAviso, setDataAviso] = useState(""); // Ex: "Próximo Sábado" ou "30/05"
  const [enviando, setEnviando] = useState(false);

  const handleSalvarAviso = async () => {
    if (!titulo.trim() || !texto.trim()) {
      Alert.alert(
        "Erro",
        "Por favor, preencha o título e o conteúdo do aviso.",
      );
      return;
    }

    setEnviando(true);
    try {
      await addDoc(collection(db, "avisos"), {
        titulo: titulo.trim(),
        texto: texto.trim(),
        dataExibicao: dataAviso.trim() || "Aviso Geral",
        dataCriacao: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Aviso publicado no quadro!");
      router.back();
    } catch (error) {
      console.error("Erro ao salvar aviso:", error);
      Alert.alert("Erro", "Não foi possível publicar o aviso.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScreenWrapper titulo="Novo Aviso" showBackButton>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Título do Aviso</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Reunião de Pais"
            value={titulo}
            onChangeText={setTitulo}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Conteúdo do Recado</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escreva aqui o que o clube precisa saber..."
            value={texto}
            onChangeText={setTexto}
            multiline
            numberOfLines={5}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Referência de Data (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Sábado, 14h ou 20/12"
            value={dataAviso}
            onChangeText={setDataAviso}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[styles.btnPublicar, enviando && styles.btnDisabled]}
            onPress={handleSalvarAviso}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="#FFF" />
                <Text style={styles.btnText}>Publicar no Quadro</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnCancelar}
            onPress={() => router.back()}
          >
            <Text style={styles.btnCancelarText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  form: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE",
    color: "#333",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  btnPublicar: {
    backgroundColor: "#8B0000",
    borderRadius: 12,
    padding: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  btnDisabled: {
    backgroundColor: "#CCC",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnCancelar: {
    marginTop: 15,
    padding: 10,
    alignItems: "center",
  },
  btnCancelarText: {
    color: "#999",
    fontWeight: "600",
  },
});
