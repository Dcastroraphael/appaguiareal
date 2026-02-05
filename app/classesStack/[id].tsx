import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import * as requisitosData from "../../data/requisitos";
import { useProgress } from "../../hooks/useProgress";

export default function DetalheClasse() {
  const { id } = useLocalSearchParams();
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

function ItemRequisito({ item }: { item: any }) {
  const { concluidos, toggleRequisito, salvarRespostaTexto, gerenciarFoto } =
    useProgress();

  // Estados baseados no banco de dados (Firestore)
  const prog = concluidos.find((c) => c.id === item.id);
  const isAprovado = prog?.status === "aprovado";
  const isPendente = prog?.status === "pendente";

  const [texto, setTexto] = useState(prog?.resposta || "");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (prog?.resposta !== undefined) setTexto(prog.resposta);
  }, [prog?.resposta]);

  // Função para marcar como concluído (Aguardando Visto)
  const handleToggle = async () => {
    if (isAprovado) return;

    if (isPendente) {
      Alert.alert(
        "Aguardando",
        "Este item já foi enviado para a diretoria avaliar.",
      );
      return;
    }

    Alert.alert(
      "Concluir Requisito",
      "Deseja enviar este requisito para a assinatura do diretor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, Concluí",
          onPress: async () => {
            setLoadingAction(true);
            try {
              await toggleRequisito(item.id); // No hook, isso deve definir status: "pendente"
            } catch (error) {
              Alert.alert("Erro", "Falha ao salvar progresso.");
            } finally {
              setLoadingAction(false);
            }
          },
        },
      ],
    );
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled) {
      setLoadingAction(true);
      try {
        await gerenciarFoto(item.id, result.assets[0].uri, "add");
        Alert.alert("Sucesso", "Foto enviada!");
      } catch (error) {
        Alert.alert("Erro", "Falha no envio da imagem.");
      } finally {
        setLoadingAction(false);
      }
    }
  };

  return (
    <View
      style={[
        styles.requisitoCard,
        isAprovado && styles.cardAprovado,
        isPendente && !isAprovado && styles.cardPendente,
      ]}
    >
      {/* CHECKBOX COM LÓGICA DE ÍCONES SOLICITADA */}
      <TouchableOpacity
        onPress={handleToggle}
        disabled={isAprovado || loadingAction}
      >
        {loadingAction ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Ionicons
            name={
              isAprovado ? "ribbon" : isPendente ? "checkbox" : "square-outline"
            }
            size={28}
            color={isAprovado ? "#FFD700" : "#FFF"}
          />
        )}
      </TouchableOpacity>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.requisitoTexto}>{item.texto}</Text>

        {item.permiteTexto && (
          <TextInput
            style={styles.inputTexto}
            value={texto}
            onChangeText={setTexto}
            onBlur={() => salvarRespostaTexto(item.id, texto)}
            placeholder="Relatório da atividade..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            multiline
            editable={!isAprovado}
          />
        )}

        {/* ÁREA DE FOTOS */}
        <View style={styles.fotoContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {prog?.fotos?.map((url: string, i: number) => (
              <View key={i} style={styles.fotoWrapper}>
                <Image source={{ uri: url }} style={styles.foto} />
                {!isAprovado && (
                  <TouchableOpacity
                    style={styles.btnTrash}
                    onPress={() => gerenciarFoto(item.id, url, "remove")}
                  >
                    <Ionicons name="trash" size={14} color="white" />
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

        {isPendente && !isAprovado && (
          <Text style={styles.statusAviso}>Aguardando visto oficial...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 25 },
  tituloCategoria: {
    color: "#999",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 11,
  },
  requisitoCard: {
    backgroundColor: "#8B0000",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
    elevation: 3,
  },
  cardAprovado: { backgroundColor: "#1B5E20" },
  cardPendente: { backgroundColor: "#A0522D" }, // Cor marrom/terrosa para indicar envio
  requisitoTexto: { color: "white", fontWeight: "600", fontSize: 14 },
  inputTexto: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    minHeight: 50,
  },
  fotoContainer: { marginTop: 12 },
  fotoWrapper: { marginRight: 8 },
  foto: { width: 60, height: 60, borderRadius: 8 },
  btnTrash: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    padding: 3,
  },
  btnAddFoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "dashed",
  },
  statusAviso: {
    color: "#FFD700",
    fontSize: 10,
    marginTop: 8,
    fontWeight: "bold",
  },
});
