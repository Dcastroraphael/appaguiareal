import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc, // Adicionado para atualizar apenas o campo de texto
  where
} from "firebase/firestore";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../config/firebase";

// 1. Interface atualizada para suportar respostas em texto
export interface RequisitoConcluido {
  id: string;
  status: "pendente" | "aprovado";
  evidenciaUrl?: string;
  resposta?: string; // Campo para o texto do desbravador
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
  salvarRespostaTexto: (id: string, texto: string) => Promise<void>; // Nova função
  addEspecialidade: (item: EspecialidadeItem) => Promise<void>;
  removerEspecialidade: (nome: string) => Promise<void>;
}

const STORAGE_KEY_PREFIX = "@progresso_v1_";
const ProgressContext = createContext<ProgressContextData>(
  {} as ProgressContextData,
);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [concluidos, setConcluidos] = useState<RequisitoConcluido[]>([]);
  const [especialidades, setEspecialidades] = useState<EspecialidadeItem[]>([]);
  const [isCarregando, setIsCarregando] = useState(true);
  const currentUid = auth.currentUser?.uid;

  const carregarDados = useCallback(async () => {
    if (!currentUid) return;
    setIsCarregando(true);
    try {
      const local = await AsyncStorage.getItem(
        `${STORAGE_KEY_PREFIX}${currentUid}`,
      );
      if (local) {
        const parsed = JSON.parse(local);
        setConcluidos(parsed.c || []);
        setEspecialidades(parsed.e || []);
      }

      const qProg = query(
        collection(db, "progresso"),
        where("userId", "==", currentUid),
      );
      const snapProg = await getDocs(qProg);
      const cloudProg = snapProg.docs.map((d) => ({
        id: d.data().requisitoId,
        status: d.data().status,
        evidenciaUrl: d.data().evidenciaUrl,
        resposta: d.data().resposta, // Carrega o texto da nuvem
      }));

      const qEsp = query(
        collection(db, "especialidades"),
        where("userId", "==", currentUid),
      );
      const snapEsp = await getDocs(qEsp);
      const cloudEsp = snapEsp.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as EspecialidadeItem,
      );

      setConcluidos(cloudProg);
      setEspecialidades(cloudEsp);
      await AsyncStorage.setItem(
        `${STORAGE_KEY_PREFIX}${currentUid}`,
        JSON.stringify({ c: cloudProg, e: cloudEsp }),
      );
    } finally {
      setIsCarregando(false);
    }
  }, [currentUid]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const toggleRequisito = async (id: string) => {
    if (!currentUid) return;
    const item = concluidos.find((c) => c.id === id);
    if (item?.status === "aprovado") return;

    if (item) {
      setConcluidos((prev) => prev.filter((i) => i.id !== id));
      await deleteDoc(doc(db, "progresso", `${currentUid}_${id}`));
    } else {
      const novo = { id, status: "pendente" as const };
      setConcluidos((prev) => [...prev, novo]);
      await setDoc(doc(db, "progresso", `${currentUid}_${id}`), {
        requisitoId: id,
        userId: currentUid,
        status: "pendente",
        updatedAt: serverTimestamp(),
      });
    }
  };

  // 2. Nova função para salvar a resposta em texto
  const salvarRespostaTexto = async (id: string, texto: string) => {
    if (!currentUid) return;

    // Atualiza estado local imediatamente para fluidez da UI
    setConcluidos((prev) => {
      const existe = prev.find((c) => c.id === id);
      if (existe) {
        return prev.map((c) => (c.id === id ? { ...c, resposta: texto } : c));
      }
      return [...prev, { id, status: "pendente", resposta: texto }];
    });

    // Salva no Firestore
    const docRef = doc(db, "progresso", `${currentUid}_${id}`);
    await setDoc(
      docRef,
      {
        requisitoId: id,
        userId: currentUid,
        status: "pendente",
        resposta: texto,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ); // Merge garante que não sobrescreva outros campos (como status)
  };

  const addEspecialidade = async (item: EspecialidadeItem) => {
    if (!currentUid) return;
    const docId = `${currentUid}_${item.nome.replace(/\s+/g, "_").toLowerCase()}`;
    setEspecialidades((prev) => [
      ...prev.filter((e) => e.nome !== item.nome),
      { ...item, id: docId },
    ]);
    await setDoc(doc(db, "especialidades", docId), {
      ...item,
      userId: currentUid,
      updatedAt: serverTimestamp(),
    });
  };

  const removerEspecialidade = async (nome: string) => {
    if (!currentUid) return;
    const docId = `${currentUid}_${nome.replace(/\s+/g, "_").toLowerCase()}`;
    setEspecialidades((prev) => prev.filter((e) => e.nome !== nome));
    await deleteDoc(doc(db, "especialidades", docId));
  };

  return (
    <ProgressContext.Provider
      value={{
        concluidos,
        especialidades,
        isCarregando,
        toggleRequisito,
        salvarRespostaTexto, // Exportando a nova função
        addEspecialidade,
        removerEspecialidade,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
