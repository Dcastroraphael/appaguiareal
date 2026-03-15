import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { db } from "../../config/firebase";
import { useProgress } from "../../hooks/useProgress";

export default function ValidarRequisitosScreen() {
  const [pendentes, setPendentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { validarRequisito } = useProgress();

  useEffect(() => {
    // Busca na coleção 'progresso' todos que estão com status pendente
    const q = query(
      collection(db, "progresso"),
      where("status", "==", "pendente"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setPendentes(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleValidar = async (item: any) => {
    try {
      // Chama a função do hook useProgress para atualizar o Firestore
      await validarRequisito(item.userId, item.requisitoId);
      Alert.alert("Sucesso", "Requisito validado com sucesso!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível validar o requisito.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* CABEÇALHO: QUEM ENVIOU */}
      <View style={styles.headerCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>DESBRAVADOR</Text>
          <Text style={styles.nomeMembro}>
            {item.usuarioNome || "Membro Desconhecido"}
          </Text>
        </View>
        <Ionicons name="time-outline" size={20} color="#E67E22" />
      </View>

      {/* REQUISITO */}
      <View style={styles.bodyCard}>
        <Text style={styles.label}>REQUISITO</Text>
        <Text style={styles.requisitoId}>
          {String(item.requisitoId).toUpperCase()}
        </Text>
      </View>

      {/* SEÇÃO DE CONTEÚDO ENVIADO PELO DBV */}
      <View style={styles.contentSection}>
        <Text style={styles.labelConteudo}>CONTEÚDO ENVIADO:</Text>

        {/* Exibe o texto se houver 'resposta' ou 'texto' no documento */}
        {item.resposta || item.texto ? (
          <View style={styles.respostatxtContainer}>
            <Text style={styles.respostatxt}>
              {item.resposta || item.texto}
            </Text>
          </View>
        ) : null}

        {/* Exibe fotos se houver o array 'fotos' ou campo 'fotoUrl' */}
        {item.fotos && item.fotos.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.fotoScroll}
          >
            {item.fotos.map((url: string, index: number) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={styles.fotoPreview}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : /* Caso específico para quando há apenas uma foto no campo fotoUrl */
        item.fotoUrl ? (
          <Image
            source={{ uri: item.fotoUrl }}
            style={[styles.fotoPreview, { width: "100%", height: 150 }]}
            resizeMode="contain"
          />
        ) : null}

        {/* Caso não tenha nada enviado */}
        {!item.resposta && !item.texto && !item.fotos && !item.fotoUrl && (
          <Text style={styles.semConteudo}>
            O desbravador não enviou texto ou fotos como evidência.
          </Text>
        )}
      </View>

      {/* BOTÃO DE AÇÃO */}
      <TouchableOpacity
        style={styles.btnValidar}
        onPress={() => handleValidar(item)}
      >
        <Ionicons name="checkmark-circle" size={18} color="#FFF" />
        <Text style={styles.btnText}>VALIDAR REQUISITO</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper titulo="Validar Requisitos">
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ffd700"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={pendentes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.empty}>
                Nenhum requisito aguardando validação.
              </Text>
            }
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15 },
  listContent: {
    paddingTop: 10,
    paddingBottom: 120, // Aumentado para o conteúdo não sumir na diagonal branca
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    color: "#888",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  nomeMembro: { fontSize: 18, fontWeight: "bold", color: "#333" },
  bodyCard: { marginBottom: 12 },
  requisitoId: { fontSize: 15, fontWeight: "bold", color: "#8B0000" },

  contentSection: {
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  labelConteudo: {
    fontSize: 9,
    color: "#444",
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  respostatxtContainer: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#8B0000",
    marginBottom: 10,
  },
  respostatxt: { fontSize: 14, color: "#333", lineHeight: 20 },
  fotoScroll: { flexDirection: "row", marginTop: 5 },
  fotoPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#CCC",
  },
  semConteudo: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    paddingVertical: 10,
    fontStyle: "italic",
  },
  btnValidar: {
    backgroundColor: "#1B5E20", // Verde Escuro
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
    gap: 10,
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  empty: {
    textAlign: "center",
    marginTop: 80,
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
