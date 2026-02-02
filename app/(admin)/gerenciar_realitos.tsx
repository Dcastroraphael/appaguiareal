import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { ScreenWrapper } from "../../components/ScreenWrapper";
import { auth, db } from "../../config/firebase";
import { useUsuario } from "../../context/UsuarioContext"; // Importando o contexto

const VALORES_REALITO = [25, 50, 75, 100];
const MAX_CONTENT_WIDTH = 800;

export default function GerenciarRealitosScreen() {
  const { usuario } = useUsuario();
  const [unidades, setUnidades] = useState<string[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [unidadeSel, setUnidadeSel] = useState<string | null>(null);
  const [pontosSel, setPontosSel] = useState<number>(100);
  const [motivo, setMotivo] = useState("");
  const [tipoOperacao, setTipoOperacao] = useState<"ganho" | "debito">("ganho");

  // Define se é diretoria para alternar a UI
  const isDiretoria =
    usuario?.cargo === "Diretor" ||
    usuario?.cargo === "Conselheiro" ||
    usuario?.cargo === "Diretoria";

  useEffect(() => {
    if (isDiretoria) {
      fetchUnidades();
    } else if (usuario?.unidade) {
      fetchHistoricoUnidade(usuario.unidade);
    }
  }, [isDiretoria, usuario?.unidade]);

  const fetchUnidades = async () => {
    try {
      const q = query(
        collection(db, "usuarios"),
        where("unidade", "!=", "Diretoria"),
      );
      const snap = await getDocs(q);
      const lista = new Set<string>();
      snap.forEach((d) => {
        const u = d.data().unidade;
        if (u) lista.add(u);
      });
      setUnidades(Array.from(lista).sort());
    } catch (e) {
      Alert.alert("Erro", "Falha ao carregar unidades.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricoUnidade = (unidadeNome: string) => {
    const q = query(
      collection(db, "historico_realitos"),
      where("unidade", "==", unidadeNome),
      orderBy("data", "desc"),
      limit(10),
    );

    return onSnapshot(q, (snap) => {
      const docs: any[] = [];
      snap.forEach((d) => docs.push({ id: d.id, ...d.data() }));
      setHistorico(docs);
      setLoading(false);
    });
  };

  const processarRealitos = async () => {
    if (!unidadeSel) return Alert.alert("Atenção", "Selecione uma unidade.");
    if (!motivo.trim()) return Alert.alert("Atenção", "Informe o motivo.");

    setProcessando(true);
    try {
      await runTransaction(db, async (transaction) => {
        const qMembros = query(
          collection(db, "usuarios"),
          where("unidade", "==", unidadeSel),
        );
        const snapMembros = await getDocs(qMembros);

        if (snapMembros.empty) throw new Error("Unidade sem membros.");

        snapMembros.forEach((membroDoc) => {
          const userRef = doc(db, "usuarios", membroDoc.id);
          const saldoAtual = membroDoc.data().realitos || 0;
          let novoSaldo =
            tipoOperacao === "ganho"
              ? saldoAtual + pontosSel
              : saldoAtual - pontosSel;

          if (novoSaldo < 0)
            throw new Error(`Saldo insuficiente: ${membroDoc.data().nome}`);

          transaction.update(userRef, {
            realitos: novoSaldo,
            ultimoMovimento: serverTimestamp(),
          });
        });

        const histRef = doc(collection(db, "historico_realitos"));
        transaction.set(histRef, {
          unidade: unidadeSel,
          valor: pontosSel,
          motivo: motivo.trim(),
          data: serverTimestamp(),
          lancadoPor: auth.currentUser?.uid || "Diretoria",
          tipo: tipoOperacao,
        });
      });

      Alert.alert("Sucesso!", "Lançamento efetuado.");
      setMotivo("");
      setUnidadeSel(null);
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setProcessando(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper titulo="Banco Águia">
        <ActivityIndicator
          size="large"
          color="#8B0000"
          style={{ marginTop: 50 }}
        />
      </ScreenWrapper>
    );
  }

  // --- INTERFACE DO DESBRAVADOR (DBV) ---
  if (!isDiretoria) {
    return (
      <ScreenWrapper titulo="Meu Saldo">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.responsiveContainer}>
            <View style={styles.cardSaldo}>
              <Text style={styles.labelSaldo}>Saldo Atual</Text>
              <View style={styles.rowSaldo}>
                <Ionicons name="wallet" size={32} color="#FFD700" />
                <Text style={styles.valorSaldo}>{usuario?.realitos || 0}</Text>
                <Text style={styles.moedaSaldo}>R$T</Text>
              </View>
              <Text style={styles.unidadeSaldo}>
                Unidade: {usuario?.unidade}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>EXTRATO DA UNIDADE</Text>
            {historico.map((item) => (
              <View key={item.id} style={styles.extratoItem}>
                <View
                  style={[
                    styles.indicator,
                    {
                      backgroundColor:
                        item.tipo === "ganho" ? "#2E7D32" : "#C62828",
                    },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.extratoMotivo}>{item.motivo}</Text>
                  <Text style={styles.extratoData}>
                    {item.data?.toDate
                      ? item.data.toDate().toLocaleDateString()
                      : "Recentemente"}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.extratoValor,
                    { color: item.tipo === "ganho" ? "#2E7D32" : "#C62828" },
                  ]}
                >
                  {item.tipo === "ganho" ? "+" : "-"}
                  {item.valor}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  // --- INTERFACE DA DIRETORIA (Lançamento) ---
  return (
    <ScreenWrapper titulo="Tesouraria" showBackButton>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.responsiveContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                tipoOperacao === "ganho" && styles.tabActiveGanho,
              ]}
              onPress={() => setTipoOperacao("ganho")}
            >
              <Ionicons
                name="trending-up"
                size={18}
                color={tipoOperacao === "ganho" ? "#fff" : "#666"}
              />
              <Text
                style={[
                  styles.tabText,
                  tipoOperacao === "ganho" && styles.textWhite,
                ]}
              >
                ADICIONAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                tipoOperacao === "debito" && styles.tabActiveDebito,
              ]}
              onPress={() => setTipoOperacao("debito")}
            >
              <Ionicons
                name="trending-down"
                size={18}
                color={tipoOperacao === "debito" ? "#fff" : "#666"}
              />
              <Text
                style={[
                  styles.tabText,
                  tipoOperacao === "debito" && styles.textWhite,
                ]}
              >
                RESGATAR
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>1. Selecione a Unidade</Text>
          <View style={styles.gridUnidades}>
            {unidades.map((un) => (
              <TouchableOpacity
                key={un}
                style={[
                  styles.btnUnidade,
                  unidadeSel === un && styles.btnUnidadeActive,
                ]}
                onPress={() => setUnidadeSel(un)}
              >
                <Text
                  style={[
                    styles.btnText,
                    unidadeSel === un && styles.textWhite,
                  ]}
                >
                  {un}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>2. Valor da Transação (R$T)</Text>
          <View style={styles.gridPontos}>
            {VALORES_REALITO.map((valor) => (
              <TouchableOpacity
                key={valor}
                style={[
                  styles.btnPonto,
                  pontosSel === valor &&
                    (tipoOperacao === "ganho"
                      ? styles.btnPontoActive
                      : styles.btnPontoActiveDebito),
                ]}
                onPress={() => setPontosSel(valor)}
              >
                <Text
                  style={[
                    styles.btnText,
                    pontosSel === valor && styles.textWhite,
                  ]}
                >
                  {valor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>3. Motivo ou Item</Text>
          <TextInput
            style={styles.inputMotivo}
            placeholder="Ex: Pontualidade ou Cantina"
            value={motivo}
            onChangeText={setMotivo}
          />

          <TouchableOpacity
            style={[
              styles.btnSalvar,
              tipoOperacao === "debito" && { backgroundColor: "#C62828" },
              (!unidadeSel || processando) && styles.btnDisabled,
            ]}
            onPress={processarRealitos}
            disabled={processando || !unidadeSel}
          >
            {processando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnSalvarText}>Confirmar Lançamento</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40, alignItems: "center" },
  responsiveContainer: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    padding: 20,
  },

  // Estilos DBV
  cardSaldo: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 25,
    alignItems: "center",
    elevation: 8,
    marginTop: -40,
    marginBottom: 30,
  },
  labelSaldo: {
    color: "#999",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  rowSaldo: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  valorSaldo: {
    fontSize: 48,
    fontWeight: "900",
    color: "#8B0000",
    marginHorizontal: 10,
  },
  moedaSaldo: {
    fontSize: 18,
    color: "#8B0000",
    fontWeight: "bold",
    marginTop: 15,
  },
  unidadeSaldo: { color: "#666", marginTop: 10, fontStyle: "italic" },
  sectionTitle: {
    color: "#BBB",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 15,
    letterSpacing: 1.5,
  },
  extratoItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
  },
  indicator: { width: 4, height: 30, borderRadius: 2, marginRight: 15 },
  extratoMotivo: { fontWeight: "bold", color: "#333", fontSize: 14 },
  extratoData: { color: "#999", fontSize: 11, marginTop: 2 },
  extratoValor: { fontWeight: "bold", fontSize: 16 },

  // Estilos Admin (Existentes e Polidos)
  tabContainer: {
    flexDirection: "row",
    marginBottom: 25,
    borderRadius: 15,
    backgroundColor: "#EEE",
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
  },
  tabActiveGanho: { backgroundColor: "#2E7D32" },
  tabActiveDebito: { backgroundColor: "#C62828" },
  tabText: { fontWeight: "bold", fontSize: 13, color: "#666" },
  textWhite: { color: "#fff" },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#BBB",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  gridUnidades: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 30,
  },
  btnUnidade: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  btnUnidadeActive: { backgroundColor: "#8B0000", borderColor: "#8B0000" },
  gridPontos: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    flexWrap: "wrap",
    gap: 10,
  },
  btnPonto: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#DDD",
  },
  btnPontoActive: { backgroundColor: "#2E7D32", borderColor: "#2E7D32" },
  btnPontoActiveDebito: { backgroundColor: "#C62828", borderColor: "#C62828" },
  btnText: { fontWeight: "bold", color: "#444" },
  inputMotivo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  btnSalvar: {
    backgroundColor: "#2E7D32",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
  },
  btnSalvarText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  btnDisabled: { backgroundColor: "#CCC" },
});
