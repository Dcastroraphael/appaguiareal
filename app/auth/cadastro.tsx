import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
  const { signUp, loading } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [unidade, setUnidade] = useState("Selecione uma unidade");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const unidadesDoClube = [
    "Diretoria",
    "Gavião",
    "Falcão",
    "Andorinha",
    "Harpia",
    "Pardal",
    "Beija-Flor",
    "Arara",
    "Gaivota",
  ];

  const selecionarUnidade = (item: string) => {
    setUnidade(item);
    setModalVisible(false);
  };

  const handleSignUp = async () => {
    // Validações básicas
    if (
      !nome.trim() ||
      !email.trim() ||
      !senha ||
      unidade === "Selecione uma unidade"
    ) {
      Alert.alert("Ops!", "Por favor, preencha todos os campos corretamente.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Senha Curta", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      // .trim() é vital para evitar erros de autenticação por espaços vazios
      await signUp(nome.trim(), email.trim(), senha, unidade);
    } catch (error: any) {
      // Tratamento de erro específico se o context não o fizer
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Erro", "Este e-mail já está em uso.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => router.replace("/auth/login")}
          style={styles.backButton}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/adaptive-icon.png")}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se ao Clube Águia Real</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={[styles.input, loading && styles.inputDisabled]}
            placeholder="Ex: Raphael de Castro"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            editable={!loading}
          />

          <Text style={styles.label}>Unidade</Text>
          <TouchableOpacity
            style={[styles.selectInput, loading && styles.inputDisabled]}
            onPress={() => setModalVisible(true)}
            disabled={loading}
          >
            <Text
              style={[
                styles.selectText,
                unidade !== "Selecione uma unidade" && {
                  color: "#000",
                  fontWeight: "500",
                },
              ]}
            >
              {unidade}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#8B0000" />
          </TouchableOpacity>

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, loading && styles.inputDisabled]}
            placeholder="seu@email.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.label}>Senha (mín. 6 caracteres)</Text>
          <TextInput
            style={[styles.input, loading && styles.inputDisabled]}
            placeholder="******"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.btnRegister, loading && styles.btnDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>FINALIZAR CADASTRO</Text>
            )}
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Escolha sua Unidade</Text>
              <FlatList
                data={unidadesDoClube}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => selecionarUnidade(item)}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        unidade === item && {
                          color: "#8B0000",
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {item}
                    </Text>
                    {unidade === item && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#8B0000"
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.btnCloseModal}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnCloseText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#8B0000",
    padding: 25,
    paddingTop: 50,
  },
  backButton: { marginBottom: 10, width: 40 },
  header: { alignItems: "center", marginBottom: 20 },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ffd700",
  },
  logoImage: { width: "80%", height: "80%", resizeMode: "contain" },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 10,
    textAlign: "center",
  },
  form: { marginTop: 10 },
  label: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 5,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
  },
  inputDisabled: { backgroundColor: "#eee", color: "#999" },
  selectInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: { fontSize: 16, color: "#999" },
  btnRegister: {
    backgroundColor: "#000",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#ffd700",
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 25,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalItemText: { fontSize: 17, color: "#333" },
  btnCloseModal: { marginTop: 20, padding: 10, alignItems: "center" },
  btnCloseText: { color: "#8B0000", fontSize: 16, fontWeight: "bold" },
});
