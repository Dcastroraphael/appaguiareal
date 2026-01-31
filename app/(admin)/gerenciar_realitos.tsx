import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { ScreenWrapper } from "../../components/ScreenWrapper";
import { auth, db } from "../../config/firebase";

const VALORES_REALITO = [25, 50, 75, 100, 500];
const { width } = Dimensions.get("window");
const MAX_CONTENT_WIDTH = 800;

export default function GerenciarRealitosScreen() {
  const [unidades, setUnidades] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [unidadeSel, setUnidadeSel] = useState<string | null>(null);
  const [pontosSel, setPontosSel] = useState<number>(100);
  const [motivo, setMotivo] = useState("");
  const [tipoOperacao, setTipoOperacao] = useState<"ganho" | "debito">("ganho");

  useEffect(() => {
    fetchUnidades();
  }, []);

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
      Alert.alert("Erro", "Não foi possível carregar as unidades.");
    } finally {
      setLoading(false);
    }
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

        if (snapMembros.empty)
          throw new Error("Esta unidade não possui membros.");

        snapMembros.forEach((membroDoc) => {
          const userRef = doc(db, "usuarios", membroDoc.id);
          const saldoAtual = membroDoc.data().realitos || 0;

          let novoSaldo =
            tipoOperacao === "ganho"
              ? saldoAtual + pontosSel
              : saldoAtual - pontosSel;

          if (novoSaldo < 0) {
            throw new Error(
              `Saldo insuficiente para: ${membroDoc.data().nome}`,
            );
          }

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

      Alert.alert(
        "Sucesso!",
        `Operação de ${tipoOperacao === "ganho" ? "Crédito" : "Resgate"} concluída para a unidade ${unidadeSel}.`,
      );

      // RESET DE CAMPOS
      setUnidadeSel(null);
      setMotivo("");
      setPontosSel(100);
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Falha na transação.");
    } finally {
      setProcessando(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper titulo="Tesouraria">
        <ActivityIndicator
          size="large"
          color="#8B0000"
          style={{ marginTop: 50 }}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper titulo="Tesouraria do Clube" showBackButton>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.responsiveContainer}>
          {/* SELETOR GANHO/DÉBITO */}
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

          {/* 1. SELEÇÃO DE UNIDADE */}
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

          {/* 2. SELEÇÃO DE VALOR */}
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

          {/* 3. MOTIVO */}
          <Text style={styles.label}>3. Motivo ou Item Comprado</Text>
          <TextInput
            style={styles.inputMotivo}
            placeholder={
              tipoOperacao === "ganho"
                ? "Ex: Pontualidade, Tarefa..."
                : "Ex: Cantina, Sorvete..."
            }
            placeholderTextColor="#AAA"
            value={motivo}
            onChangeText={setMotivo}
          />

          {/* BOTÃO CONFIRMAR */}
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
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.btnSalvarText}>Confirmar Lançamento</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.infoFooter}>
            * Esta ação atualizará o saldo de TODOS os membros da unidade
            selecionada.
          </Text>
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
  tabContainer: {
    flexDirection: "row",
    marginBottom: 25,
    borderRadius: 15,
    overflow: "hidden",
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B0000",
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
    borderWidth: 1.5,
    borderColor: "#DDD",
    minWidth: 80,
    alignItems: "center",
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
    borderWidth: 1.5,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 30,
  },
  btnSalvar: {
    backgroundColor: "#2E7D32",
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  btnSalvarText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  btnDisabled: { backgroundColor: "#CCC", elevation: 0 },
  infoFooter: {
    marginTop: 15,
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    fontStyle: "italic",
  },
});
