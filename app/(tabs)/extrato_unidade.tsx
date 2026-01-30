import { Ionicons } from "@expo/vector-icons";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";

interface Transacao {
  id: string;
  valor: number;
  data: any;
  motivo: string;
  tipo: "ganho" | "debito";
}

export default function ExtratoUnidadeScreen() {
  const { user } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [saldoUnidade, setSaldoUnidade] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.unidade) buscarDadosUnidade();
  }, [user]);

  const buscarDadosUnidade = async () => {
    try {
      setLoading(true);
      const qMembros = query(
        collection(db, "usuarios"),
        where("unidade", "==", user?.unidade),
      );
      const snapMembros = await getDocs(qMembros);
      let total = 0;
      snapMembros.forEach((d) => (total += d.data().realitos || 0));
      setSaldoUnidade(total);

      const qHist = query(
        collection(db, "historico_realitos"),
        where("unidade", "==", user?.unidade),
        orderBy("data", "desc"),
        limit(30),
      );
      const snapHist = await getDocs(qHist);
      const lista: Transacao[] = [];
      snapHist.forEach((d) =>
        lista.push({ id: d.id, ...d.data() } as Transacao),
      );
      setTransacoes(lista);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Transacao }) => {
    const isDebito = item.tipo === "debito";
    return (
      <View style={styles.itemTransacao}>
        <View
          style={[
            styles.iconBolinha,
            { backgroundColor: isDebito ? "#ffebee" : "#e8f5e9" },
          ]}
        >
          <Ionicons
            name={isDebito ? "cart-outline" : "trending-up"}
            size={20}
            color={isDebito ? "#c62828" : "#2e7d32"}
          />
        </View>
        <View style={styles.infoTransacao}>
          <Text style={styles.motivoText}>{item.motivo}</Text>
          <Text style={styles.dataText}>
            {item.data?.toDate().toLocaleDateString("pt-BR")}
          </Text>
        </View>
        <Text
          style={[
            styles.valorTexto,
            { color: isDebito ? "#c62828" : "#2e7d32" },
          ]}
        >
          {isDebito ? "-" : "+"}
          {item.valor} R$T
        </Text>
      </View>
    );
  };

  return (
    <ScreenWrapper titulo="Tesouraria da Unidade">
      <View style={styles.headerSaldo}>
        <Text style={styles.labelSaldo}>
          Saldo Disponível ({user?.unidade})
        </Text>
        <Text style={styles.valorSaldo}>R$T {saldoUnidade}</Text>
      </View>

      <View style={styles.containerExtrato}>
        <Text style={styles.tituloSecao}>Movimentações</Text>
        {loading ? (
          <ActivityIndicator color="#8B0000" />
        ) : (
          <FlatList
            data={transacoes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.empty}>Nenhum movimento registrado.</Text>
            }
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerSaldo: {
    backgroundColor: "#8B0000",
    padding: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  labelSaldo: { color: "#FFD700", fontWeight: "bold", marginBottom: 5 },
  valorSaldo: { color: "#fff", fontSize: 36, fontWeight: "900" },
  containerExtrato: { flex: 1, padding: 20 },
  tituloSecao: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#444",
  },
  itemTransacao: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  iconBolinha: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  infoTransacao: { flex: 1, marginLeft: 15 },
  motivoText: { fontWeight: "bold", color: "#333" },
  dataText: { fontSize: 12, color: "#999" },
  valorTexto: { fontWeight: "bold", fontSize: 16 },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
});
