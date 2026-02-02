import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Alert,
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

const CORES_CLASSES: Record<string, string> = {
  amigo: "#0000FF",
  companheiro: "#FF0000",
  pesquisador: "#008000",
  pioneiro: "#4e4c4e",
  excursionista: "#7919a5",
  guia: "#d0d32b",
};

export default function DetalheClasse() {
  const { id } = useLocalSearchParams();
  const { concluidos, toggleRequisito, salvarRespostaTexto } = useProgress();

  const classeId = String(id).toLowerCase();
  const categorias = (requisitosData as any)[classeId] || [];
  const corBase = CORES_CLASSES[classeId] || "#8B0000";

  const handleSeleccionarMidia = async (
    requisitoTexto: string,
    isAprovado: boolean,
  ) => {
    if (isAprovado) {
      return Alert.alert(
        "Concluído",
        "Este requisito já foi assinado pelo instrutor.",
      );
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera.");
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      Alert.alert("Sucesso!", "Evidência capturada!");
    }
  };

  return (
    <ScreenWrapper titulo="Requisitos" showBackButton={true}>
      <Stack.Screen options={{ title: "", headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {categorias.map((cat: any, index: number) => (
          <View key={index} style={styles.section}>
            <Text style={styles.tituloCategoria}>
              {cat.categoria.toUpperCase()}
            </Text>

            {cat.itens.map((item: any) => {
              const progresso = concluidos?.find((c) => c.id === item.id);
              const isChecked = !!progresso;
              const isAprovado = progresso?.status === "aprovado";

              // Se for apenas um enunciado (Ex: "Escolha um abaixo")
              if (item.somenteTexto) {
                return (
                  <View key={item.id} style={styles.enunciadoContainer}>
                    <Text style={styles.enunciadoTexto}>{item.texto}</Text>
                  </View>
                );
              }

              return (
                <View
                  key={item.id}
                  style={[styles.requisitoCard, { backgroundColor: corBase }]}
                >
                  {/* CHECKBOX LATERAL */}
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => toggleRequisito(item.id)}
                    disabled={isAprovado}
                  >
                    <Ionicons
                      name={
                        isAprovado
                          ? "ribbon"
                          : isChecked
                            ? "checkbox"
                            : "square-outline"
                      }
                      size={26}
                      color={isAprovado ? "#FFD700" : "#FFF"}
                    />
                  </TouchableOpacity>

                  <View style={styles.contentContainer}>
                    <Text style={styles.requisitoTexto}>{item.texto}</Text>

                    {/* CAMPO DE TEXTO (Se o requisito exigir resposta escrita) */}
                    {item.permiteTexto && (
                      <TextInput
                        style={[
                          styles.inputTexto,
                          isAprovado && styles.inputDisabled,
                        ]}
                        placeholder="Escreva seu relatório/resposta aqui..."
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        multiline
                        value={progresso?.resposta || ""}
                        onChangeText={(txt) =>
                          salvarRespostaTexto(item.id, txt)
                        }
                        editable={!isAprovado}
                      />
                    )}

                    {/* BOTÕES DE AÇÃO (FOTO) */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={[styles.btnFoto, isAprovado && { opacity: 0.5 }]}
                        onPress={() =>
                          handleSeleccionarMidia(item.texto, isAprovado)
                        }
                        disabled={isAprovado}
                      >
                        <Ionicons
                          name={isAprovado ? "checkmark-circle" : "camera"}
                          size={16}
                          color="#FFF"
                        />
                        <Text style={styles.btnFotoText}>
                          {isAprovado ? "Evidência Aprovada" : "Anexar Foto"}
                        </Text>
                      </TouchableOpacity>

                      {isAprovado && (
                        <View style={styles.badgeAprovado}>
                          <Text style={styles.txtAprovado}>ASSINADO</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  section: { marginBottom: 25 },
  tituloCategoria: {
    color: "#BBB",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 15,
    letterSpacing: 1.5,
  },
  enunciadoContainer: {
    marginBottom: 15,
    paddingHorizontal: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#8B0000",
  },
  enunciadoTexto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    fontStyle: "italic",
  },
  requisitoCard: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 16,
    borderRadius: 15,
    alignItems: "flex-start",
    elevation: 4,
  },
  checkbox: { marginRight: 12, marginTop: 2 },
  contentContainer: { flex: 1 },
  requisitoTexto: {
    color: "#FFF",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 12,
  },
  inputTexto: {
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 10,
    padding: 12,
    color: "#FFF",
    fontSize: 14,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputDisabled: {
    backgroundColor: "rgba(0,0,0,0.05)",
    color: "rgba(255,255,255,0.7)",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnFoto: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  btnFotoText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  badgeAprovado: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  txtAprovado: { color: "#8B0000", fontWeight: "900", fontSize: 10 },
});
