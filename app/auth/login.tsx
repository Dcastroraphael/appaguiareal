import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/buttons";
import { Input } from "../../components/input";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { signIn, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    // 1. Validação básica
    if (!email || !senha) {
      if (Platform.OS === "web") {
        alert("Atenção: Preencha todos os campos.");
      } else {
        Alert.alert("Atenção", "Preencha todos os campos.");
      }
      return;
    }

    try {
      console.log("Tentando login com:", email.trim());

      // 2. Chama o login. Se falhar, o erro cairá no catch abaixo.
      await signIn(email.trim(), senha);

      console.log("Login disparado com sucesso no Firebase.");
      // Nota: Não fazemos router.push aqui pois o _layout.tsx
      // detecta a mudança de 'user' e redireciona sozinho.
    } catch (error: any) {
      console.error("Erro no processo de Login:", error);

      // 3. Feedback visual para o usuário
      const mensagemErro =
        error.message || "Erro desconhecido. Verifique sua conexão.";

      if (Platform.OS === "web") {
        alert("Erro ao entrar: " + mensagemErro);
      } else {
        Alert.alert("Erro de Autenticação", mensagemErro);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/adaptive-icon.png")}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.title}>Águia Real</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <Input
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() => router.push("/auth/recuperar" as any)}
            style={styles.forgotPassword}
          >
            <Text style={styles.yellowTextBold}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <Button
            title={loading ? "CARREGANDO..." : "ENTRAR"}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.btnLogin}
          />

          <TouchableOpacity
            onPress={() => router.push("/auth/cadastro" as any)}
            style={styles.containerCadastro}
          >
            <Text style={styles.whiteText}>
              Não tem conta?{" "}
              <Text style={styles.yellowTextBold}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#8B0000" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 25 },
  header: { alignItems: "center", marginBottom: 30 },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ffd700",
  },
  logoImage: { width: "70%", height: "70%", resizeMode: "contain" },
  title: { color: "#fff", fontSize: 28, fontWeight: "bold", marginTop: 10 },
  form: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 20,
  },
  forgotPassword: { alignSelf: "flex-end", marginBottom: 20 },
  containerCadastro: { marginTop: 20, alignItems: "center" },
  whiteText: { color: "#fff" },
  yellowTextBold: { color: "#ffd700", fontWeight: "bold" },
  btnLogin: {
    backgroundColor: "#000",
    borderColor: "#ffd700",
    borderWidth: 1,
    height: 55,
  },
});
