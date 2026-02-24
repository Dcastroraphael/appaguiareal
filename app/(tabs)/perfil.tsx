import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
  const { usuario, atualizarDados } = useUsuario();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ESTADOS
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
      Alert.alert(
        "Sucesso",
        "Foto carregada! Clique em Salvar Perfil para confirmar.",
      );
    } catch (error) {
      console.error(error);
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
        fotoPerfil: fotoPerfil, // Adicionado aqui
        ultimaAtualizacao: serverTimestamp(),
      };

      await updateDoc(userRef, dadosParaAtualizar);
      atualizarDados(dadosParaAtualizar);

      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper titulo="Editar Perfil">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* SEÇÃO DA FOTO DE PERFIL (MOLDURA) */}
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

        <Text style={styles.sectionTitle}>Dados Pessoais</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Tipo Sanguíneo</Text>
            <TextInput
              style={styles.input}
              value={tipoSanguineo}
              onChangeText={setTipoSanguineo}
              placeholder="Ex: A+"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 2 }]}>
            <Text style={styles.label}>Contato/Telefone</Text>
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

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>No Clube</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cargo (Identificação)</Text>
          <TextInput
            style={styles.input}
            value={cargo}
            onChangeText={setCargo}
            placeholder="Ex: Conselheiro, Desbravador..."
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
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, paddingBottom: 40 },

  // ESTILOS DA MOLDURA DE FOTO
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  moldura: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F0F0F0",
    borderWidth: 3,
    borderColor: "#8B0000",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  foto: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  btnAlterarFoto: {
    flexDirection: "row",
    backgroundColor: "#8B0000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: -15, // Sobrepõe levemente a moldura
    alignItems: "center",
    gap: 5,
  },
  btnAlterarFotoText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#8B0000",
    paddingLeft: 10,
  },
  inputGroup: { marginBottom: 15 },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  row: { flexDirection: "row" },
  unidadesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  chipActive: { backgroundColor: "#8B0000", borderColor: "#8B0000" },
  chipText: { color: "#666", fontSize: 13 },
  chipTextActive: { color: "#FFF", fontWeight: "bold" },
  btnSalvar: {
    backgroundColor: "#1B5E20",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
