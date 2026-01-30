import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../config/firebase"; // Certifique-se que o caminho está correto

export default function RecuperarScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    // 1. Validação básica de campo
    if (!email || !email.includes("@")) {
      Alert.alert("Atenção", "Por favor, digite um e-mail válido.");
      return;
    }

    setLoading(true);
    try {
      // 2. Chamada ao Firebase
      await sendPasswordResetEmail(auth, email.trim());

      Alert.alert(
        "Sucesso",
        "Link de redefinição enviado! Verifique sua caixa de entrada e spam.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }],
      );
    } catch (error: any) {
      console.error("Erro Firebase:", error.code);

      // 3. Tratamento de erros comuns do Firebase
      let message = "Não foi possível enviar o e-mail.";
      if (error.code === "auth/user-not-found")
        message = "E-mail não cadastrado.";
      if (error.code === "auth/invalid-email")
        message = "Formato de e-mail inválido.";

      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#8B0000" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            Digite seu e-mail cadastrado e enviaremos as instruções para criar
            uma nova senha.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Seu e-mail cadastrado"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#999"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>ENVIAR INSTRUÇÕES</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 30, justifyContent: "center" },
  backButton: {
    position: "absolute",
    top: Platform.OS === "web" ? 20 : 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 10,
  },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 30, lineHeight: 22 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  button: {
    backgroundColor: "#8B0000",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
