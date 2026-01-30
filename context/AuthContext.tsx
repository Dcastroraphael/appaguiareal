import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

// Importações do Firebase
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, getDocFromCache, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// 1. Definição da Interface
interface AuthContextData {
  user: any | null;
  isReady: boolean;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signUp: (
    nome: string,
    email: string,
    senha: string,
    unidade: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // 2. Monitoramento em tempo real do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        try {
          // PROTEÇÃO: Só prossegue se tiver um UID válido
          if (firebaseUser?.uid) {
            const userRef = doc(db, "usuarios", firebaseUser.uid);
            let userDoc;

            try {
              // Tenta cache primeiro para velocidade, se falhar vai pro servidor
              userDoc = await getDocFromCache(userRef);
            } catch (e) {
              userDoc = await getDoc(userRef);
            }

            if (userDoc.exists()) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...userDoc.data(),
              });
            } else {
              // Caso o doc no Firestore ainda não exista (momento do cadastro)
              setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Erro ao sincronizar usuário:", error);
          setUser(null);
        } finally {
          setIsReady(true);
        }
      },
    );

    return unsubscribe;
  }, []);

  // 3. Sistema de Redirecionamento (Ajustado para evitar loops)
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      // Se não está logado e não está na pasta auth, vai para o login
      router.replace("/auth/login");
    } else if (user && inAuthGroup) {
      // Se está logado e está na pasta auth, vai para a home
      // IMPORTANTE: Mudei para index pois é o ponto de entrada do Drawer/Tabs
      router.replace("/(tabs)");
    }
  }, [user, segments, isReady]);

  // 4. Funções de Ação
  const signIn = async (email: string, senha: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (error: any) {
      let message = "Erro ao entrar. Verifique seus dados.";
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        message = "E-mail ou senha incorretos.";
      }
      Alert.alert("Erro de Login", message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    nome: string,
    email: string,
    senha: string,
    unidade: string,
  ) => {
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha,
      );

      const userData = {
        nome,
        unidade,
        email: email.trim(),
        createdAt: new Date().toISOString(),
      };

      // Cria o documento no Firestore
      await setDoc(doc(db, "usuarios", credential.user.uid), userData);

      // NOTA: Não setamos o User aqui manualmente.
      // O onAuthStateChanged lá em cima vai detectar a criação e atualizar o estado.
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Erro", "Este e-mail já está em uso.");
      } else {
        Alert.alert("Erro no Cadastro", "Verifique os dados informados.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Erro ao sair:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isReady, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
