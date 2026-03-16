import { onAuthStateChanged } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";

const ProgressContext = createContext<any>({});

export const ProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [concluidos, setConcluidos] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [user, setUser] = useState(auth.currentUser);
  const storage = getStorage();

  // 1. Monitorar Estado de Autenticação
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Monitorar Progresso (Classes/Requisitos)
  useEffect(() => {
    if (!user) {
      setConcluidos([]);
      return;
    }

    const q = query(
      collection(db, "progresso"),
      where("userId", "==", user.uid),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        docId: d.id,
        ...d.data(),
      }));
      setConcluidos(data);
    });

    return () => unsub();
  }, [user]);

  // 3. Monitorar Especialidades
  useEffect(() => {
    if (!user) {
      setEspecialidades([]);
      return;
    }

    const q = query(
      collection(db, "especialidades"),
      where("userId", "==", user.uid),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setEspecialidades(data);
    });

    return () => unsub();
  }, [user]);

  // --- FUNÇÕES DE REQUISITOS (CLASSES) ---

  const toggleRequisito = async (requisitoId: string) => {
    if (!user) return;

    const customDocId = `${user.uid}_${requisitoId}`;
    const docRef = doc(db, "progresso", customDocId);
    const jaExiste = concluidos.find((c) => c.requisitoId === requisitoId);

    try {
      if (jaExiste) {
        if (jaExiste.status === "aprovado") return;
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          requisitoId: requisitoId,
          userId: user.uid,
          status: "pendente",
          updatedAt: serverTimestamp(),
          fotos: [],
          resposta: "",
        });
      }
    } catch (e) {
      console.error("Erro ao alternar requisito:", e);
    }
  };

  // NOVA FUNÇÃO: Validar Requisito (usada pela diretoria)
  const validarRequisito = async (
    targetUserId: string,
    requisitoId: string,
  ) => {
    // Usamos o padrão de ID que você criou: userId_requisitoId
    const customDocId = `${targetUserId}_${requisitoId}`;
    const docRef = doc(db, "progresso", customDocId);

    try {
      await updateDoc(docRef, {
        status: "aprovado",
        dataVisto: serverTimestamp(),
        // Você pode adicionar vistoPorNome: user.displayName aqui se quiser
      });
    } catch (e) {
      console.error("Erro ao validar requisito:", e);
      throw e;
    }
  };

  const salvarRespostaTexto = async (requisitoId: string, texto: string) => {
    if (!user) return;
    const customDocId = `${user.uid}_${requisitoId}`;
    const docRef = doc(db, "progresso", customDocId);

    try {
      await setDoc(
        docRef,
        {
          requisitoId: requisitoId,
          userId: user.uid,
          resposta: texto,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (e) {
      console.error("Erro ao salvar texto:", e);
    }
  };

  const gerenciarFoto = async (
    requisitoId: string,
    uri: string,
    acao: "add" | "remove",
  ) => {
    if (!user) return;
    const customDocId = `${user.uid}_${requisitoId}`;
    const docRef = doc(db, "progresso", customDocId);

    try {
      if (acao === "add") {
        const response = await fetch(uri);
        const blob = await response.blob();
        const sRef = ref(
          storage,
          `progresso/${user.uid}/${requisitoId}/${Date.now()}`,
        );
        await uploadBytes(sRef, blob);
        const url = await getDownloadURL(sRef);

        await setDoc(
          docRef,
          {
            requisitoId,
            userId: user.uid,
            status: "pendente",
            fotos: arrayUnion(url),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } else {
        await updateDoc(docRef, { fotos: arrayRemove(uri) });
      }
    } catch (e) {
      console.error("Erro ao gerenciar foto:", e);
    }
  };

  // --- FUNÇÕES DE ESPECIALIDADES ---

  const addEspecialidade = async (nome: string, categoria: string) => {
    if (!user) return;
    try {
      const newDocRef = doc(collection(db, "especialidades"));

      await setDoc(newDocRef, {
        userId: user.uid,
        nome: nome,
        categoria: categoria,
        status: "concluido",
        dataCadastro: serverTimestamp(),
      });
    } catch (e) {
      console.error("Erro ao cadastrar especialidade:", e);
      throw e;
    }
  };

  const removerEspecialidade = async (especialidadeId: string) => {
    if (!user) return;
    try {
      const docRef = doc(db, "especialidades", especialidadeId);
      await deleteDoc(docRef);
    } catch (e) {
      console.error("Erro ao remover especialidade:", e);
      throw e;
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        concluidos,
        especialidades,
        toggleRequisito,
        validarRequisito, // Adicionado ao Provider
        gerenciarFoto,
        addEspecialidade,
        removerEspecialidade,
        salvarRespostaTexto,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
