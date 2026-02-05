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

// --- TIPAGENS ---
export interface RequisitoConcluido {
  id: string; // Isso mapeia para requisitoId
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

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  local?: string;
}

interface ProgressContextData {
  concluidos: RequisitoConcluido[];
  especialidades: EspecialidadeItem[];
  eventos: Evento[]; // Adicionado lista de eventos
  isCarregando: boolean;

  // Ações
  toggleRequisito: (id: string) => Promise<void>;
  salvarRespostaTexto: (id: string, texto: string) => Promise<void>;
  gerenciarFoto: (
    id: string,
    url: string,
    acao: "add" | "remove",
  ) => Promise<void>;

  addEspecialidade: (item: EspecialidadeItem) => Promise<void>;
  removerEspecialidade: (id: string) => Promise<void>; // Mudado para receber ID

  removerEvento: (id: string) => Promise<void>; // NOVA FUNÇÃO
}

const ProgressContext = createContext<ProgressContextData>(
  {} as ProgressContextData,
);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [concluidos, setConcluidos] = useState<RequisitoConcluido[]>([]);
  const [especialidades, setEspecialidades] = useState<EspecialidadeItem[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isCarregando, setIsCarregando] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setConcluidos([]);
      setEspecialidades([]);
      setEventos([]);
      setIsCarregando(false);
      return;
    }

    setIsCarregando(true);

    // 1. PROGRESSO (Requisitos)
    const qProg = query(
      collection(db, "progresso"),
      where("userId", "==", user.uid),
    );
    const unsubProg = onSnapshot(qProg, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.data().requisitoId, // Mapeamento crucial
        status: d.data().status,
        fotos: d.data().fotos || [],
        resposta: d.data().resposta || "",
      })) as RequisitoConcluido[];
      setConcluidos(data);
    });

    // 2. ESPECIALIDADES
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
    });

    // 3. EVENTOS (Geral)
    const qEventos = query(collection(db, "eventos"));
    const unsubEventos = onSnapshot(qEventos, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Evento[];
      setEventos(data);
      setIsCarregando(false);
    });

    return () => {
      unsubProg();
      unsubEsp();
      unsubEventos();
    };
  }, [user]);

  // --- FUNÇÕES DE AÇÃO ---

  const toggleRequisito = async (requisitoId: string) => {
    if (!user) return;
    const item = concluidos.find((c) => c.id === requisitoId);

    // Bloqueia se já estiver aprovado
    if (item?.status === "aprovado") return;

    const docRef = doc(db, "progresso", `${user.uid}_${requisitoId}`);

    if (item) {
      // Se existe e está pendente, o usuário pode desmarcar (deletar)
      await deleteDoc(docRef);
    } else {
      // Se não existe, CRIA como pendente
      await setDoc(docRef, {
        requisitoId: requisitoId, // Salva o ID do requisito explicitamente
        userId: user.uid,
        status: "pendente",
        updatedAt: serverTimestamp(),
      });
    }
  };

  const salvarRespostaTexto = async (requisitoId: string, texto: string) => {
    if (!user) return;
    const docRef = doc(db, "progresso", `${user.uid}_${requisitoId}`);

    // setDoc com merge garante que cria se não existir
    await setDoc(
      docRef,
      {
        requisitoId: requisitoId,
        userId: user.uid,
        status: "pendente",
        resposta: texto,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const gerenciarFoto = async (
    requisitoId: string,
    url: string,
    acao: "add" | "remove",
  ) => {
    if (!user) return;
    const docRef = doc(db, "progresso", `${user.uid}_${requisitoId}`);

    // Garante criação do doc antes de atualizar array
    await setDoc(
      docRef,
      {
        requisitoId: requisitoId,
        userId: user.uid,
        status: "pendente",
      },
      { merge: true },
    );

    await updateDoc(docRef, {
      fotos: acao === "add" ? arrayUnion(url) : arrayRemove(url),
      status: "pendente", // Força status pendente ao mexer na foto
      updatedAt: serverTimestamp(),
    });
  };

  const addEspecialidade = async (item: EspecialidadeItem) => {
    if (!user) return;
    // Usa timestamp para garantir ID único se o nome tiver caracteres especiais
    const docRef = doc(collection(db, "especialidades"));

    await setDoc(docRef, {
      ...item,
      userId: user.uid,
      status: "aprovado",
      dataConclusao: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
  };

  const removerEspecialidade = async (id: string) => {
    if (!user || !id) return;
    await deleteDoc(doc(db, "especialidades", id));
  };

  const removerEvento = async (id: string) => {
    // Adicione validação de cargo aqui se necessário (ex: só diretor remove)
    if (!id) return;
    await deleteDoc(doc(db, "eventos", id));
  };

  return (
    <ProgressContext.Provider
      value={{
        concluidos,
        especialidades,
        eventos,
        isCarregando,
        toggleRequisito,
        salvarRespostaTexto,
        gerenciarFoto,
        addEspecialidade,
        removerEspecialidade,
        removerEvento,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
