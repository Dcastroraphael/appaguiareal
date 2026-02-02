import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import * as requisitosData from "../../data/requisitos";
import { useProgress } from "../../hooks/useProgress"; // Caminho corrigido

// Mapeamento de cores oficiais por classe
const CORES_CLASSES: Record<string, string> = {
  amigo: "#0000FF", // Azul
  companheiro: "#FF0000", // Vermelho
  pesquisador: "#008000", // Verde
  pioneiro: "#493e49", // Cinza
  excursionista: "#7919a5", // Roxo
  guia: "#d0d32b", // Amarelo
};

export default function DetalheClasse() {
  const { id } = useLocalSearchParams();
  const { concluidos, toggleRequisito } = useProgress();

  const classeId = String(id).toLowerCase();
  const categorias = (requisitosData as any)[classeId] || [];
  const corBase = CORES_CLASSES[classeId] || "#8B0000";

  // FUNÇÃO PARA ACIONAR A CÂMERA/GALERIA
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
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à câmera para anexar a evidência.",
      );
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      // Logica de upload para o Firebase Storage entraria aqui
      Alert.alert(
        "Sucesso!",
        "Evidência capturada para: " + requisitoTexto.substring(0, 20) + "...",
      );
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

              return (
                <View
                  key={item.id}
                  style={[styles.requisitoCard, { backgroundColor: corBase }]}
                >
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

                    {/* BOTÃO DE EVIDÊNCIA CONDICIONAL */}
                    {!item.somenteTexto && (
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
                          {isAprovado
                            ? "Evidência Aprovada"
                            : "Foto / Evidência"}
                        </Text>
                      </TouchableOpacity>
                    )}
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
  requisitoCard: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 16,
    borderRadius: 15,
    alignItems: "flex-start",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  requisitoTexto: {
    color: "#FFF",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 12,
  },
  btnFoto: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  btnFotoText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
