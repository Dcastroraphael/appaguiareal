import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Firebase
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

// Componentes
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { Button } from "../../components/buttons";
import { Input } from "../../components/input";

export default function NovoEventoScreen() {
  const router = useRouter();

  // Estados
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Função para aplicar máscara de data (DD/MM/AAAA)
  const formatarData = (text: string) => {
    const limpo = text.replace(/\D/g, "");
    let formatado = limpo;
    if (limpo.length > 2) formatado = `${limpo.slice(0, 2)}/${limpo.slice(2)}`;
    if (limpo.length > 4)
      formatado = `${formatado.slice(0, 5)}/${limpo.slice(4, 8)}`;
    setData(formatado);
  };

  // Função para aplicar máscara de hora (HH:MM)
  const formatarHora = (text: string) => {
    const limpo = text.replace(/\D/g, "");
    let formatado = limpo;
    if (limpo.length > 2)
      formatado = `${limpo.slice(0, 2)}:${limpo.slice(2, 4)}`;
    setHora(formatado);
  };

  const handleSalvarEvento = async () => {
    // 1. Validação Básica
    if (!titulo.trim() || data.length < 10 || !local.trim()) {
      return Alert.alert(
        "Atenção",
        "Por favor, preencha o título, o local e a data completa (DD/MM/AAAA).",
      );
    }

    setCarregando(true);

    try {
      // 2. Salva no Firestore
      await addDoc(collection(db, "eventos"), {
        titulo: titulo.trim(),
        data: data, // String formatada
        hora: hora,
        local: local.trim(),
        descricao: descricao.trim(),
        tipo: "geral", // Útil para filtros futuros
        criadoEm: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Evento publicado com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      Alert.alert("Erro", "Falha ao conectar com o banco de dados.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScreenWrapper titulo="Novo Evento" showBackButton={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Input
              label="Título do Evento"
              icon="bookmark-outline"
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Reunião de Unidade"
            />

            <View style={styles.row}>
              <View style={{ flex: 1.2, marginRight: 10 }}>
                <Input
                  label="Data"
                  icon="calendar-outline"
                  value={data}
                  onChangeText={formatarData}
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
              <View style={{ flex: 0.8 }}>
                <Input
                  label="Hora"
                  icon="time-outline"
                  value={hora}
                  onChangeText={formatarHora}
                  placeholder="00:00"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>

            <Input
              label="Local"
              icon="location-outline"
              value={local}
              onChangeText={setLocal}
              placeholder="Ex: Galpão ou Quadra"
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descrição / Detalhes</Text>
              <View style={styles.textAreaContainer}>
                <Ionicons
                  name="text-outline"
                  size={20}
                  color="#8B0000" // Tom de destaque
                  style={{ marginRight: 10, marginTop: 5 }}
                />
                <TextInput
                  style={styles.textArea}
                  value={descricao}
                  onChangeText={setDescricao}
                  multiline={true}
                  numberOfLines={4}
                  placeholder="O que levar? Qual o uniforme?"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <Button
              title="CRIAR EVENTO"
              onPress={handleSalvarEvento}
              loading={carregando}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  form: { marginTop: 10, gap: 5 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputContainer: { marginBottom: 15 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
    marginLeft: 4,
  },
  textAreaContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1.5,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    minHeight: 120,
    // Sombra leve para combinar com os outros inputs
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    flex: 1,
    textAlignVertical: "top",
    color: "#333",
    fontSize: 16,
    paddingTop: 0,
  },
  saveButton: {
    marginTop: 15,
    backgroundColor: "#000",
    borderRadius: 12,
    height: 55,
    borderWidth: 1,
    borderColor: "#ffd700",
  },
});
