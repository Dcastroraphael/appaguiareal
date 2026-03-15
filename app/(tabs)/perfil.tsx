import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { auth, db } from "../../config/firebase";
import { useUsuario } from "../../context/UsuarioContext";

const UNIDADES_OFICIAIS = [
  "Andorinha",
  "Arara",
  "Beija-flor",
  "Diretoria",
  "Falcão",
  "Gaivota",
  "Gavião",
  "Harpia",
  "Pardal",
  "Rouxinol",
];

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { usuario, atualizarDados } = useUsuario();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [nome, setNome] = useState(usuario?.nome || "");
  const [unidade, setUnidade] = useState(usuario?.unidade || "");
  const [cargo, setCargo] = useState(usuario?.cargo || "");
  const [tipoSanguineo, setTipoSanguineo] = useState(
    usuario?.tipoSanguineo || "",
  );
  const [telefone, setTelefone] = useState(usuario?.telefone || "");
  const [endereco, setEndereco] = useState(usuario?.endereco || "");
  const [fotoPerfil, setFotoPerfil] = useState(usuario?.fotoUrl || null);

  const storage = getStorage();

  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      uploadImagem(result.assets[0].uri);
    }
  };

  const uploadImagem = async (uri: string) => {
    if (!auth.currentUser) return;
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      setFotoPerfil(url);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleSalvar = async () => {
    if (!auth.currentUser) return;
    if (!unidade) return Alert.alert("Erro", "Selecione sua unidade.");

    setLoading(true);
    try {
      const userRef = doc(db, "usuarios", auth.currentUser.uid);
      const dadosParaAtualizar = {
        nome: nome.trim(),
        unidade: unidade,
        cargo: cargo.trim(),
        tipoSanguineo: tipoSanguineo.trim(),
        telefone: telefone.trim(),
        endereco: endereco.trim(),
        fotoUrl: fotoPerfil,
        ultimaAtualizacao: serverTimestamp(),
      };

      await updateDoc(userRef, dadosParaAtualizar);
      if (atualizarDados) await atualizarDados(dadosParaAtualizar);

      Alert.alert("Sucesso", "Perfil atualizado!", [
        { text: "OK", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper titulo="Editar Perfil" showBackButton={true}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* CONTAINER DO AVATAR FORA DO CARD PARA DAR DESTAQUE */}
        <View style={styles.avatarContainer}>
          <View style={styles.moldura}>
            {fotoPerfil ? (
              <Image source={{ uri: fotoPerfil }} style={styles.foto} />
            ) : (
              <Ionicons name="person" size={60} color="#CCC" />
            )}
            {uploading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color="#FFF" />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.btnAlterarFoto}
            onPress={escolherImagem}
          >
            <Ionicons name="camera" size={20} color="#FFF" />
            <Text style={styles.btnAlterarFotoText}>Alterar Foto</Text>
          </TouchableOpacity>
        </View>

        {/* CARD BRANCO PARA CONTRASTE - Resolve o problema do texto camuflado */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Tipo Sanguíneo</Text>
              <TextInput
                style={styles.input}
                value={tipoSanguineo}
                onChangeText={setTipoSanguineo}
                placeholder="A+"
                autoCapitalize="characters"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 2 }]}>
              <Text style={styles.label}>Contato</Text>
              <TextInput
                style={styles.input}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              value={endereco}
              onChangeText={setEndereco}
            />
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>No Clube</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cargo</Text>
            <TextInput
              style={styles.input}
              value={cargo}
              onChangeText={setCargo}
            />
          </View>

          <Text style={styles.label}>Unidade</Text>
          <View style={styles.unidadesGrid}>
            {UNIDADES_OFICIAIS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.chip, unidade === item && styles.chipActive]}
                onPress={() => setUnidade(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    unidade === item && styles.chipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.btnSalvar}
            onPress={handleSalvar}
            disabled={loading || uploading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnText}>SALVAR PERFIL</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 15, paddingBottom: 60 },
  avatarContainer: { alignItems: "center", marginBottom: 20, marginTop: 10 },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  moldura: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F0F0F0",
    borderWidth: 3,
    borderColor: "#FFF", // Moldura branca para destacar do vermelho
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  foto: { width: "100%", height: "100%" },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  btnAlterarFoto: {
    flexDirection: "row",
    backgroundColor: "#8B0000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginTop: -10,
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "#FFF",
  },
  btnAlterarFotoText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#8B0000",
    paddingLeft: 10,
  },
  inputGroup: { marginBottom: 12 },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: "#333",
  },
  row: { flexDirection: "row" },
  unidadesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 20,
    marginTop: 5,
  },
  chip: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  chipActive: { backgroundColor: "#8B0000" },
  chipText: { color: "#666", fontSize: 12 },
  chipTextActive: { color: "#FFF", fontWeight: "bold" },
  btnSalvar: {
    backgroundColor: "#1B5E20",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
