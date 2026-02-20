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

// Componentes e Dados
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { classes } from "../../data/classes";
import * as requisitosData from "../../data/requisitos";
import { useProgress } from "../../hooks/useProgress";

export default function DetalheClasse() {
  const { id } = useLocalSearchParams();
  const classeId = String(id).toLowerCase();

  const dadosClasse = classes.find((c) => c.id.toLowerCase() === classeId);
  const corClasse = dadosClasse?.cor || "#8B0000";

  // Carrega as categorias de requisitos baseadas no ID da classe
  const categorias = (requisitosData as any)[classeId] || [];

  return (
    <ScreenWrapper titulo={dadosClasse?.nome || "Requisitos"} showBackButton>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {categorias.length > 0 ? (
          categorias.map((cat: any, idx: number) => (
            <View key={idx} style={styles.section}>
              <Text style={styles.tituloCategoria}>
                {cat.categoria.toUpperCase()}
              </Text>
              {cat.itens.map((item: any) => (
                <ItemRequisito key={item.id} item={item} corBase={corClasse} />
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text>Nenhum requisito encontrado para esta classe.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

function ItemRequisito({ item, corBase }: { item: any; corBase: string }) {
  const { concluidos, toggleRequisito, salvarRespostaTexto, gerenciarFoto } =
    useProgress();

  // Busca o progresso específico deste requisito no estado global/firestore
  const prog = concluidos.find((c: any) => c.requisitoId === item.id);

  const isAprovado = prog?.status === "aprovado";
  const isPendente = prog?.status === "pendente";

  const [texto, setTexto] = useState(prog?.resposta || "");
  const [loadingAction, setLoadingAction] = useState(false);

  // Sincroniza o texto local com o que vem do banco
  useEffect(() => {
    if (prog?.resposta !== undefined) {
      setTexto(prog.resposta);
    }
  }, [prog?.resposta]);

  // Função para marcar/desmarcar o requisito
  const handleToggle = async () => {
    if (isAprovado) {
      Alert.alert(
        "Requisito Aprovado",
        "Este item já foi assinado pela diretoria e não pode ser alterado.",
      );
      return;
    }

    setLoadingAction(true);
    try {
      await toggleRequisito(item.id);
      // O hook useProgress deve atualizar o estado 'concluidos',
      // o que fará este componente refletir a mudança automaticamente.
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao atualizar o status do requisito.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão", "Precisamos de acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setLoadingAction(true);
      try {
        await gerenciarFoto(item.id, result.assets[0].uri, "add");
      } catch (error) {
        Alert.alert("Erro", "Falha ao enviar imagem.");
      } finally {
        setLoadingAction(false);
      }
    }
  };

  const handleRemoveImage = (url: string) => {
    Alert.alert("Remover Foto", "Deseja excluir esta evidência?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          setLoadingAction(true);
          try {
            await gerenciarFoto(item.id, url, "remove");
          } catch (error) {
            Alert.alert("Erro", "Falha ao remover imagem.");
          } finally {
            setLoadingAction(false);
          }
        },
      },
    ]);
  };

  return (
    <View
      style={[
        styles.requisitoCard,
        { backgroundColor: isAprovado ? "#1B5E20" : corBase },
        isPendente && !isAprovado && styles.cardPendente,
      ]}
    >
      <TouchableOpacity
        onPress={handleToggle}
        disabled={isAprovado || loadingAction}
        style={styles.checkArea}
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
                    onPress={() => handleRemoveImage(url)}
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
    letterSpacing: 1,
  },
  requisitoCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: "row",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardPendente: {
    borderLeftWidth: 6,
    borderLeftColor: "#FFD700",
  },
  checkArea: {
    justifyContent: "flex-start",
    paddingTop: 2,
  },
  requisitoTexto: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 20,
  },
  inputTexto: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    minHeight: 60,
    textAlignVertical: "top",
  },
  fotoContainer: { marginTop: 15 },
  fotoWrapper: { marginRight: 12, position: "relative" },
  foto: { width: 70, height: 70, borderRadius: 10 },
  btnTrash: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4444",
    borderRadius: 12,
    padding: 5,
    elevation: 5,
    zIndex: 10,
  },
  btnAddFoto: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "white",
    borderStyle: "dashed",
  },
  statusAviso: {
    color: "#FFD700",
    fontSize: 11,
    marginTop: 10,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
});
