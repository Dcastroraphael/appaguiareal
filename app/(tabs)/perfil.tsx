import { Ionicons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Firebase
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../config/firebase";

// Componentes e Contextos
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { Button } from "../../components/buttons";
import { Input } from "../../components/input";
import { useAuth } from "../../context/AuthContext";
import { useUsuario } from "../../context/UsuarioContext";

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { usuario, atualizarDados } = useUsuario();

  // Estados dos campos
  const [editNome, setEditNome] = useState("");
  const [editUnidade, setEditUnidade] = useState("");
  const [editFoto, setEditFoto] = useState("");
  const [editCargo, setEditCargo] = useState("");
  const [editSangue, setEditSangue] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editTelefone, setEditTelefone] = useState("");

  const [carregando, setCarregando] = useState(false);

  // Inicializa os dados do usuário
  useEffect(() => {
    if (usuario) {
      setEditNome(usuario.nome || "");
      setEditUnidade(usuario.unidade || "");
      setEditFoto(usuario.foto || "");
      setEditCargo(usuario.cargo || "");
      setEditSangue(usuario.tipoSanguineo || "");
      setEditEmail(usuario.email || "");
      setEditTelefone(usuario.telefone || "");
    }
  }, [usuario]);

  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso às suas fotos.",
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          resultado.assets[0].uri,
          [{ resize: { width: 400, height: 400 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
        );
        setEditFoto(manipResult.uri);
      } catch (error) {
        Alert.alert("Erro", "Falha ao processar imagem.");
      }
    }
  };

  const handleSalvar = async () => {
    if (!editNome.trim()) return Alert.alert("Erro", "O nome é obrigatório.");
    if (!user?.uid) return Alert.alert("Erro", "Usuário não autenticado.");

    setCarregando(true);

    try {
      let urlFinalDaFoto = editFoto;

      // Logica de Upload para o Firebase Storage
      const ehFotoNova =
        editFoto &&
        (editFoto.startsWith("file://") ||
          editFoto.startsWith("content://") ||
          editFoto.startsWith("/"));

      if (ehFotoNova) {
        const response = await fetch(editFoto);
        const blob = await response.blob();
        const fotoRef = ref(storage, `perfis/${user.uid}.jpg`);
        await uploadBytes(fotoRef, blob);
        urlFinalDaFoto = await getDownloadURL(fotoRef);
      }

      const userRef = doc(db, "usuarios", user.uid);

      // Dados para o Firestore
      const dadosFirestore = {
        nome: editNome.trim(),
        unidade: editUnidade.trim(),
        foto: urlFinalDaFoto,
        cargo: editCargo.trim(),
        tipoSanguineo: editSangue.trim().toUpperCase(),
        email: editEmail.trim().toLowerCase(),
        telefone: editTelefone.trim(),
        ultimaAtualizacao: serverTimestamp(),
      };

      await updateDoc(userRef, dadosFirestore);

      // Dados para o Contexto Local
      const dadosLocal = {
        ...dadosFirestore,
        ultimaAtualizacao: new Date().toISOString(),
      };

      // @ts-ignore
      atualizarDados(dadosLocal);

      Alert.alert("Sucesso", "Perfil atualizado!");
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Falha ao salvar: " + error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScreenWrapper titulo="Meu Perfil" showBackButton={true}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            {editFoto ? (
              <Image source={{ uri: editFoto }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={70} color="#ccc" />
              </View>
            )}

            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={selecionarImagem}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome Completo"
            icon="person-outline"
            value={editNome}
            onChangeText={setEditNome}
          />
          <Input
            label="Cargo/Função"
            icon="briefcase-outline"
            value={editCargo}
            onChangeText={setEditCargo}
          />
          <Input
            label="Unidade"
            icon="shield-outline"
            value={editUnidade}
            onChangeText={setEditUnidade}
          />
          <Input
            label="Tipo Sanguíneo"
            icon="water-outline"
            value={editSangue}
            onChangeText={setEditSangue}
            placeholder="Ex: O+"
          />
          <Input
            label="E-mail"
            icon="mail-outline"
            value={editEmail}
            onChangeText={setEditEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="WhatsApp"
            icon="logo-whatsapp"
            value={editTelefone}
            onChangeText={setEditTelefone}
            keyboardType="phone-pad"
          />

          <Button
            title={carregando ? "SALVANDO..." : "RENOVAR PERFIL"}
            onPress={handleSalvar}
            loading={carregando}
            disabled={carregando}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  photoSection: { alignItems: "center", marginVertical: 20 },
  avatarContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#f0f0f0",
    borderWidth: 4,
    borderColor: "#ffd700",
    position: "relative",
  },
  avatarPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: { width: "100%", height: "100%", borderRadius: 61 },
  cameraBtn: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#8B0000",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 5,
  },
  form: { width: "100%" },
  saveButton: {
    marginTop: 25,
    backgroundColor: "#000",
    borderColor: "#ffd700",
    borderWidth: 1.5,
    height: 55,
  },
});
