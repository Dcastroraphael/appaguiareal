import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import * as requisitosData from "../../data/requisitos";
import { useProgress } from "../../hooks/useProgress";

export default function DetalheClasse() {
  const { id } = useLocalSearchParams();
  const { concluidos, toggleRequisito, salvarRespostaTexto, gerenciarFoto } =
    useProgress();

  const classeId = String(id).toLowerCase();
  const categorias = (requisitosData as any)[classeId] || [];

  return (
    <ScreenWrapper titulo="Requisitos" showBackButton>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.container}>
        {categorias.map((cat: any, idx: number) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.tituloCategoria}>
              {cat.categoria.toUpperCase()}
            </Text>
            {cat.itens.map((item: any) => (
              <ItemRequisito key={item.id} item={item} />
            ))}
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

// Componente Interno para isolar o estado do TextInput e não travar a lista
function ItemRequisito({ item }: { item: any }) {
  const { concluidos, toggleRequisito, salvarRespostaTexto, gerenciarFoto } =
    useProgress();
  const prog = concluidos.find((c) => c.id === item.id);
  const isAprovado = prog?.status === "aprovado";
  const [texto, setTexto] = useState(prog?.resposta || "");

  // Sincroniza texto se vier do banco (ex: carregamento inicial)
  useEffect(() => {
    if (prog?.resposta) setTexto(prog.resposta);
  }, [prog?.resposta]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!result.canceled) {
      // Aqui você enviaria para o Storage e pegaria a URL.
      // Vou simular enviando a URI local para teste:
      await gerenciarFoto(item.id, result.assets[0].uri, "add");
    }
  };

  return (
    <View style={[styles.requisitoCard, isAprovado && styles.cardAprovado]}>
      <TouchableOpacity
        onPress={() => toggleRequisito(item.id)}
        disabled={isAprovado}
      >
        <Ionicons
          name={isAprovado ? "ribbon" : prog ? "checkbox" : "square-outline"}
          size={26}
          color={isAprovado ? "#FFD700" : "#FFF"}
        />
      </TouchableOpacity>

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.requisitoTexto}>{item.texto}</Text>

        {item.permiteTexto && (
          <TextInput
            style={styles.inputTexto}
            value={texto}
            onChangeText={setTexto}
            onBlur={() => salvarRespostaTexto(item.id, texto)}
            placeholder="Relatório..."
            multiline
            editable={!isAprovado}
          />
        )}

        {/* Galeria de Fotos */}
        <ScrollView horizontal style={{ marginTop: 10 }}>
          {prog?.fotos?.map((url, i) => (
            <View key={i} style={styles.fotoWrapper}>
              <Image source={{ uri: url }} style={styles.foto} />
              {!isAprovado && (
                <TouchableOpacity
                  style={styles.btnTrash}
                  onPress={() => gerenciarFoto(item.id, url, "remove")}
                >
                  <Ionicons name="trash" size={16} color="white" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          {!isAprovado && (
            <TouchableOpacity
              style={styles.btnAddFoto}
              onPress={handlePickImage}
            >
              <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  section: { marginBottom: 20 },
  tituloCategoria: { color: "#888", fontWeight: "bold", marginBottom: 10 },
  requisitoCard: {
    backgroundColor: "#8B0000",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
  },
  cardAprovado: { backgroundColor: "#2E7D32" },
  requisitoTexto: { color: "white", fontWeight: "600" },
  inputTexto: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  fotoWrapper: { marginRight: 8 },
  foto: { width: 60, height: 60, borderRadius: 8 },
  btnTrash: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "red",
    borderRadius: 10,
    padding: 2,
  },
  btnAddFoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
