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
import { classes } from "../../data/classes"; // Importante para as cores
import * as requisitosData from "../../data/requisitos";
import { useProgress } from "../../hooks/useProgress";

export default function DetalheClasse() {
  const { id } = useLocalSearchParams();
  const classeId = String(id).toLowerCase();

  // Recupera os dados da classe para pegar a cor oficial
  const dadosClasse = classes.find((c) => c.id.toLowerCase() === classeId);
  const corClasse = dadosClasse?.cor || "#8B0000";

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
              <ItemRequisito key={item.id} item={item} corBase={corClasse} />
            ))}
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

function ItemRequisito({ item, corBase }: { item: any; corBase: string }) {
  const { concluidos, toggleRequisito, salvarRespostaTexto, gerenciarFoto } =
    useProgress();

  const prog = concluidos.find((c) => c.id === item.id);
  const isAprovado = prog?.status === "aprovado";
  const isPendente = prog?.status === "pendente";

  const [texto, setTexto] = useState(prog?.resposta || "");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (prog?.resposta !== undefined) setTexto(prog.resposta);
  }, [prog?.resposta]);

  const handleToggle = async () => {
    if (isAprovado) return;
    if (isPendente) {
      Alert.alert("Aguardando", "Este item já está em análise pela diretoria.");
      return;
    }

    Alert.alert(
      "Concluir Requisito",
      "Deseja marcar como concluído e enviar para o diretor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, Concluí",
          onPress: async () => {
            setLoadingAction(true);
            try {
              // toggleRequisito deve salvar no Firestore com status: "pendente"
              await toggleRequisito(item.id);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível marcar o requisito.");
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
        // gerenciarFoto deve fazer o upload e setar status: "pendente" no Firestore
        await gerenciarFoto(item.id, result.assets[0].uri, "add");
        Alert.alert("Enviado!", "Sua foto foi enviada para avaliação.");
      } catch (error) {
        Alert.alert("Erro", "Falha ao enviar imagem.");
      } finally {
        setLoadingAction(false);
      }
    }
  };

  return (
    <View
      style={[
        styles.requisitoCard,
        { backgroundColor: corBase }, // Aplica a cor da classe dinamicamente
        isAprovado && styles.cardAprovado,
        isPendente && !isAprovado && styles.cardPendente,
      ]}
    >
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
                disabled={loadingAction}
              >
                {loadingAction ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Ionicons name="camera" size={24} color="white" />
                )}
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
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardAprovado: { backgroundColor: "#1B5E20" }, // Verde ao aprovar
  cardPendente: {
    opacity: 0.9,
    borderLeftWidth: 5,
    borderLeftColor: "#FFD700",
  }, // Destaque para pendente
  requisitoTexto: { color: "white", fontWeight: "600", fontSize: 14 },
  inputTexto: {
    backgroundColor: "rgba(255,255,255,0.15)",
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
