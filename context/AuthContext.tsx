import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, getDocFromCache, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../config/firebase";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        try {
          if (firebaseUser?.uid) {
            const userRef = doc(db, "usuarios", firebaseUser.uid);
            let userDoc;
            try {
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
      await setDoc(doc(db, "usuarios", credential.user.uid), userData);
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
