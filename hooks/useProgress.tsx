import AsyncStorage from "@react-native-async-storage/async-storage";
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
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";

export interface RequisitoConcluido {
  id: string;
  status: "pendente" | "aprovado";
  fotos?: string[];
  resposta?: string;
}

export interface EspecialidadeItem {
  id?: string;
  nome: string;
  categoria: string;
  userId: string;
  status: "pendente" | "aprovado";
  dataConclusao?: string;
}

interface ProgressContextData {
  concluidos: RequisitoConcluido[];
  especialidades: EspecialidadeItem[];
  isCarregando: boolean;
  toggleRequisito: (id: string) => Promise<void>;
  salvarRespostaTexto: (id: string, texto: string) => Promise<void>;
  gerenciarFoto: (
    id: string,
    url: string,
    acao: "add" | "remove",
  ) => Promise<void>;
  addEspecialidade: (item: EspecialidadeItem) => Promise<void>;
  removerEspecialidade: (nome: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextData>(
  {} as ProgressContextData,
);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [concluidos, setConcluidos] = useState<RequisitoConcluido[]>([]);
  const [especialidades, setEspecialidades] = useState<EspecialidadeItem[]>([]);
  const [isCarregando, setIsCarregando] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setConcluidos([]);
      setEspecialidades([]);
      setIsCarregando(false);
      return;
    }

    setIsCarregando(true);

    const qProg = query(
      collection(db, "progresso"),
      where("userId", "==", user.uid),
    );
    const unsubProg = onSnapshot(qProg, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.data().requisitoId, // Mapeia o requisitoId para id
        status: d.data().status,
        fotos: d.data().fotos || [],
        resposta: d.data().resposta || "",
      })) as RequisitoConcluido[];

      setConcluidos(data);
      AsyncStorage.setItem(`@prog_c_${user.uid}`, JSON.stringify(data));
    });

    const qEsp = query(
      collection(db, "especialidades"),
      where("userId", "==", user.uid),
    );
    const unsubEsp = onSnapshot(qEsp, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as EspecialidadeItem[];
      setEspecialidades(data);
      AsyncStorage.setItem(`@prog_e_${user.uid}`, JSON.stringify(data));
      setIsCarregando(false);
    });

    return () => {
      unsubProg();
      unsubEsp();
    };
  }, [user]);

  // CORREÇÃO: Toggle agora marca como pendente e permite desmarcar se não estiver aprovado
  const toggleRequisito = async (id: string) => {
    if (!user) return;
    const item = concluidos.find((c) => c.id === id);

    // Se já estiver aprovado, o desbravador não pode mexer
    if (item?.status === "aprovado") return;

    const docRef = doc(db, "progresso", `${user.uid}_${id}`);

    if (item) {
      // Se já existe e ele clicou de novo, deletamos (desmarcar)
      await deleteDoc(docRef);
    } else {
      // Se não existe, criamos como PENDENTE
      await setDoc(docRef, {
        requisitoId: id,
        userId: user.uid,
        status: "pendente",
        updatedAt: serverTimestamp(),
      });
    }
  };

  const salvarRespostaTexto = async (id: string, texto: string) => {
    if (!user) return;
    const docRef = doc(db, "progresso", `${user.uid}_${id}`);
    await setDoc(
      docRef,
      {
        requisitoId: id,
        userId: user.uid,
        status: "pendente", // Sempre volta para pendente ao editar texto
        resposta: texto,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const gerenciarFoto = async (
    id: string,
    url: string,
    acao: "add" | "remove",
  ) => {
    if (!user) return;
    const docRef = doc(db, "progresso", `${user.uid}_${id}`);

    // Garante que o documento existe
    await setDoc(
      docRef,
      { requisitoId: id, userId: user.uid, status: "pendente" },
      { merge: true },
    );

    // Atualiza o array de fotos e reseta para pendente para nova avaliação
    await updateDoc(docRef, {
      fotos: acao === "add" ? arrayUnion(url) : arrayRemove(url),
      status: "pendente",
      updatedAt: serverTimestamp(),
    });
  };

  const addEspecialidade = async (item: EspecialidadeItem) => {
    if (!user) return;
    const docId = `${user.uid}_${item.nome.replace(/\s+/g, "_").toLowerCase()}`;
    await setDoc(doc(db, "especialidades", docId), {
      ...item,
      userId: user.uid,
      status: "aprovado",
      dataConclusao: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
  };

  const removerEspecialidade = async (nome: string) => {
    if (!user) return;
    const docId = `${user.uid}_${nome.replace(/\s+/g, "_").toLowerCase()}`;
    await deleteDoc(doc(db, "especialidades", docId));
  };

  return (
    <ProgressContext.Provider
      value={{
        concluidos,
        especialidades,
        isCarregando,
        toggleRequisito,
        salvarRespostaTexto,
        gerenciarFoto,
        addEspecialidade,
        removerEspecialidade,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
