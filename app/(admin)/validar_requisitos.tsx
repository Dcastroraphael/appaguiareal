import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
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
    // 1. Busca requisitos com status 'pendente'
    const q = query(
      collection(db, "progresso"),
      where("status", "==", "pendente"),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      // 2. Criamos uma lista de promessas para buscar os nomes dos usuários
      const listaPromessas = snapshot.docs.map(async (d) => {
        const dados = d.data();
        let nomeFinal = dados.usuarioNome || "Membro Desconhecido";

        // 3. Se o nome não estiver no documento, buscamos na coleção 'usuarios'
        if (!dados.usuarioNome && dados.userId) {
          try {
            const userDoc = await getDoc(doc(db, "usuarios", dados.userId));
            if (userDoc.exists()) {
              nomeFinal =
                userDoc.data().nome ||
                userDoc.data().displayName ||
                "Membro sem Nome";
            }
          } catch (error) {
            console.error("Erro ao buscar nome:", error);
          }
        }

        return {
          id: d.id,
          ...dados,
          usuarioNome: nomeFinal, // Sobrescreve ou define o nome correto
        };
      });

      // 4. Aguarda todas as consultas terminarem antes de atualizar o estado
      const listaCompleta = await Promise.all(listaPromessas);
      setPendentes(listaCompleta);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleValidar = async (item: any) => {
    try {
      await validarRequisito(item.userId, item.requisitoId);
      Alert.alert("Sucesso", "Requisito validado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível validar.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.headerCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>DESBRAVADOR</Text>
          <Text style={styles.nomeMembro}>{item.usuarioNome}</Text>
        </View>
        <Ionicons name="time-outline" size={20} color="#E67E22" />
      </View>

      <View style={styles.bodyCard}>
        <Text style={styles.label}>REQUISITO</Text>
        <Text style={styles.requisitoId}>
          {String(item.requisitoId).toUpperCase()}
        </Text>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.labelConteudo}>CONTEÚDO ENVIADO:</Text>

        {item.resposta || item.texto ? (
          <View style={styles.respostatxtContainer}>
            <Text style={styles.respostatxt}>
              {item.resposta || item.texto}
            </Text>
          </View>
        ) : null}

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
        ) : item.fotoUrl ? (
          <Image
            source={{ uri: item.fotoUrl }}
            style={[styles.fotoPreview, { width: "100%", height: 150 }]}
            resizeMode="contain"
          />
        ) : null}

        {!item.resposta && !item.texto && !item.fotos && !item.fotoUrl && (
          <Text style={styles.semConteudo}>Nenhuma evidência enviada.</Text>
        )}
      </View>

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
    <ScreenWrapper titulo={`Validar\nrequisitos`}>
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
            showsVerticalScrollIndicator={false}
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
  container: { flex: 1 },
  listContent: {
    paddingTop: 10,
    paddingBottom: 150, // Espaço extra para a diagonal branca do ScreenWrapper
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    color: "#999",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  nomeMembro: { fontSize: 18, fontWeight: "bold", color: "#333" },
  bodyCard: { marginBottom: 12 },
  requisitoId: { fontSize: 14, fontWeight: "bold", color: "#8B0000" },
  contentSection: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  labelConteudo: {
    fontSize: 9,
    color: "#666",
    fontWeight: "bold",
    marginBottom: 8,
  },
  respostatxtContainer: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#8B0000",
    marginBottom: 10,
  },
  respostatxt: { fontSize: 14, color: "#444", lineHeight: 20 },
  fotoScroll: { flexDirection: "row", marginTop: 5 },
  fotoPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#EEE",
  },
  semConteudo: {
    fontSize: 12,
    color: "#AAA",
    textAlign: "center",
    paddingVertical: 10,
    fontStyle: "italic",
  },
  btnValidar: {
    backgroundColor: "#2E7D32", // Verde suave
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  empty: {
    textAlign: "center",
    marginTop: 80,
    color: "#999",
    fontSize: 15,
  },
});
