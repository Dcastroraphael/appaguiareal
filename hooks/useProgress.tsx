import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../config/firebase";

// 1. Interface de Requisitos das CLASSES (O que o Diretor assina)
export interface RequisitoConcluido {
  id: string;
  status: "pendente" | "aprovado";
  evidenciaUrl?: string;
  resposta?: string;
}

// 2. Interface de ESPECIALIDADES (Itens independentes)
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
      // 1. Tenta carregar Cache Local (Performance)
      const local = await AsyncStorage.getItem(
        `${STORAGE_KEY_PREFIX}${currentUid}`,
      );
      if (local) {
        const parsed = JSON.parse(local);
        setConcluidos(parsed.c || []);
        setEspecialidades(parsed.e || []);
      }

      // 2. Busca PROGRESSO DAS CLASSES na Nuvem
      const qProg = query(
        collection(db, "progresso"),
        where("userId", "==", currentUid),
      );
      const snapProg = await getDocs(qProg);
      const cloudProg = snapProg.docs.map((d) => ({
        id: d.data().requisitoId,
        status: d.data().status,
        evidenciaUrl: d.data().evidenciaUrl,
        resposta: d.data().resposta,
      }));

      // 3. Busca ESPECIALIDADES na Nuvem
      const qEsp = query(
        collection(db, "especialidades"),
        where("userId", "==", currentUid),
      );
      const snapEsp = await getDocs(qEsp);
      const cloudEsp = snapEsp.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as EspecialidadeItem,
      );

      // Atualiza Estados e Cache
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

  // Gerencia o Checkbox das Classes
  const toggleRequisito = async (id: string) => {
    if (!currentUid) return;
    const item = concluidos.find((c) => c.id === id);
    if (item?.status === "aprovado") return;

    if (item) {
      setConcluidos((prev) => prev.filter((i) => i.id !== id));
      await deleteDoc(doc(db, "progresso", `${currentUid}_${id}`));
    } else {
      const novo: RequisitoConcluido = { id, status: "pendente" };
      setConcluidos((prev) => [...prev, novo]);
      await setDoc(doc(db, "progresso", `${currentUid}_${id}`), {
        requisitoId: id,
        userId: currentUid,
        status: "pendente",
        updatedAt: serverTimestamp(),
      });
    }
  };

  // Salva o Relatório/Texto das Classes
  const salvarRespostaTexto = async (id: string, texto: string) => {
    if (!currentUid) return;

    setConcluidos((prev) => {
      const existe = prev.find((c) => c.id === id);
      if (existe) {
        return prev.map((c) => (c.id === id ? { ...c, resposta: texto } : c));
      }
      return [...prev, { id, status: "pendente", resposta: texto }];
    });

    await setDoc(
      doc(db, "progresso", `${currentUid}_${id}`),
      {
        requisitoId: id,
        userId: currentUid,
        status: "pendente",
        resposta: texto,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  // Gerencia Especialidades (Fluxo à parte)
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
        salvarRespostaTexto,
        addEspecialidade,
        removerEspecialidade,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
