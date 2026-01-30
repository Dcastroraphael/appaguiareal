import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { ScreenWrapper } from "../../components/ScreenWrapper";
import { classes } from "../../data/classes";
import * as requisitosData from "../../data/requisitos";
import { useProgress } from "../../hooks/useProgress";

export default function ClassDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Garantimos que o hook de progresso sempre retorne objetos/arrays válidos
  const {
    concluidos = [],
    toggleRequisito,
    textosUsuario = {},
    setTexto,
    fotos = {},
    setFoto,
  } = useProgress();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [tempText, setTempText] = useState("");

  // 1. Normalização Segura de Dados
  const classeId = useMemo(() => (id ? String(id).toLowerCase() : ""), [id]);

  const infoClasse = useMemo(
    () => classes.find((c) => c.id.toLowerCase() === classeId),
    [classeId],
  );

  const corClasse = infoClasse?.cor || "#333";

  // 2. Busca de Categorias com Fallback para evitar Tela Branca
  const categoriasDaClasse = useMemo(() => {
    if (!classeId) return null;
    const base = requisitosData as Record<string, any>;

    // Tenta encontrar a chave independente de maiúsculas/minúsculas
    const chaveCorreta = Object.keys(base).find(
      (key) => key.toLowerCase() === classeId,
    );

    return chaveCorreta ? base[chaveCorreta] : null;
  }, [classeId]);

  // 3. Handlers com try/catch para evitar crashes
  const tirarFoto = useCallback(
    async (itemId: string) => {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão negada",
            "Precisamos da câmera para as evidências.",
          );
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.4, // Reduzi para otimizar o carregamento
        });

        if (!result.canceled && result.assets[0].uri) {
          setFoto(itemId, result.assets[0].uri);
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível abrir a câmera.");
      }
    },
    [setFoto],
  );

  const abrirModalAnotacao = (item: any) => {
    setSelectedItem(item);
    setTempText(textosUsuario[item.id] || "");
    setModalVisible(true);
  };

  const salvarAnotacao = () => {
    if (selectedItem?.id) {
      setTexto(selectedItem.id, tempText);
      setModalVisible(false);
    }
  };

  // Tela de Erro Amigável (Caso a classe não exista no requisitos.ts)
  if (!categoriasDaClasse) {
    return (
      <ScreenWrapper titulo="Classe não encontrada" showBackButton={true}>
        <View style={styles.containerErro}>
          <Ionicons
            name="search-outline"
            size={70}
            color="rgba(255,255,255,0.5)"
          />
          <Text style={styles.tituloErro}>Dados não localizados</Text>
          <Text style={styles.subtituloErro}>
            Os requisitos para "{id}" não foram configurados no sistema.
          </Text>
          <TouchableOpacity
            style={styles.btnVoltar}
            onPress={() => router.back()}
          >
            <Text style={styles.btnVoltarText}>Voltar para Classes</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      titulo={`Classe ${infoClasse?.nome || id}`}
      showBackButton={true}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categoriasDaClasse.map((secao: any, idx: number) => (
          <View key={`section-${idx}`} style={styles.sectionContainer}>
            <View style={styles.sectionTitleBadge}>
              <Text style={styles.sectionTitleText}>{secao.categoria}</Text>
            </View>

            {secao.itens?.map((item: any) => {
              const progresso = concluidos.find((c) => c.id === item.id);
              const isMarcado = !!progresso;
              const isAprovado = progresso?.status === "aprovado";
              const fotoUri = fotos[item.id];

              return (
                <View
                  key={item.id}
                  style={[
                    styles.reqCard,
                    { backgroundColor: corClasse },
                    isAprovado && styles.cardAprovado,
                  ]}
                >
                  <View style={styles.reqTopRow}>
                    <Text style={styles.reqText}>{item.texto}</Text>
                    {!item.somenteTexto && (
                      <TouchableOpacity
                        style={[
                          styles.checkbox,
                          isMarcado && styles.checkboxChecked,
                        ]}
                        onPress={() => toggleRequisito(item.id)}
                        activeOpacity={0.7}
                      >
                        {isMarcado && (
                          <Ionicons
                            name={
                              isAprovado
                                ? "checkmark-done-circle"
                                : "checkmark-circle"
                            }
                            size={24}
                            color="#fff"
                          />
                        )}
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Box de Evidências Cadastradas */}
                  {(textosUsuario[item.id] || fotoUri) && (
                    <View style={styles.boxEvidencia}>
                      {fotoUri && (
                        <Image
                          source={{ uri: fotoUri }}
                          style={styles.miniFoto}
                        />
                      )}
                      {textosUsuario[item.id] && (
                        <View style={{ flex: 1 }}>
                          <Text style={styles.txtSalvo} numberOfLines={4}>
                            "{textosUsuario[item.id]}"
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Ações (Anotar e Foto) */}
                  {!item.somenteTexto && !isAprovado && (
                    <View style={styles.actionRow}>
                      {item.permiteTexto && (
                        <TouchableOpacity
                          style={styles.btnAção}
                          onPress={() => abrirModalAnotacao(item)}
                        >
                          <Ionicons
                            name="document-text"
                            size={16}
                            color="#fff"
                          />
                          <Text style={styles.btnAçãoText}>Anotar</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.btnAção}
                        onPress={() => tirarFoto(item.id)}
                      >
                        <Ionicons name="camera" size={16} color="#fff" />
                        <Text style={styles.btnAçãoText}>
                          {fotoUri ? "Alterar Foto" : "Foto"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {isAprovado && (
                    <View style={styles.aprovadoBadge}>
                      <Ionicons name="ribbon" size={14} color="#FFD700" />
                      <Text style={styles.aprovadoText}>
                        REQUISITO ASSINADO
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Modal de Anotação */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Evidência</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#999" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Descreva como você cumpriu este requisito..."
              value={tempText}
              onChangeText={setTempText}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.btnSalvar, { backgroundColor: corClasse }]}
              onPress={salvarAnotacao}
            >
              <Text style={styles.btnSalvarText}>Salvar na Ficha</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, paddingBottom: 100 },
  sectionContainer: { marginBottom: 25 },
  sectionTitleBadge: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: "flex-start",
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#333",
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#333",
    textTransform: "uppercase",
  },
  reqCard: {
    padding: 18,
    marginBottom: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardAprovado: { opacity: 0.9, borderWidth: 2, borderColor: "#FFD700" },
  reqTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  reqText: {
    color: "#fff",
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    paddingRight: 10,
  },
  checkbox: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { borderRadius: 20 },
  boxEvidencia: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.15)",
    padding: 12,
    borderRadius: 15,
    marginTop: 15,
    alignItems: "center",
    gap: 12,
  },
  miniFoto: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  txtSalvo: {
    color: "#fff",
    fontSize: 13,
    fontStyle: "italic",
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  btnAção: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  btnAçãoText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "bold",
  },
  aprovadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "rgba(255,215,0,0.2)",
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: 5,
  },
  aprovadoText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    minHeight: "45%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: "800", color: "#333" },
  input: {
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    padding: 20,
    height: 150,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
  },
  btnSalvar: {
    marginTop: 20,
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  btnSalvarText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  containerErro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    marginTop: 50,
  },
  tituloErro: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtituloErro: {
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    opacity: 0.7,
    lineHeight: 22,
  },
  btnVoltar: {
    marginTop: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 15,
  },
  btnVoltarText: { color: "#000", fontWeight: "bold" },
});
