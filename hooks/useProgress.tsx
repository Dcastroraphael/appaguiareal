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
  useRef,
  useState,
} from "react";
import { auth, db } from "../config/firebase";

export interface RequisitoConcluido {
  id: string;
  status: "pendente" | "aprovado";
}

export interface EspecialidadeItem {
  id?: string;
  nome: string;
  categoria: string;
  userId: string;
  dataConclusao?: string;
}

interface ProgressContextData {
  concluidos: RequisitoConcluido[];
  textosUsuario: Record<string, string>;
  fotos: Record<string, string>;
  especialidades: EspecialidadeItem[];
  isCarregando: boolean;
  toggleRequisito: (id: string) => void;
  setTexto: (id: string, texto: string) => void;
  setFoto: (id: string, uri: string) => void;
  aprovarRequisito: (id: string) => void;
  desaprovarRequisito: (id: string) => void;
  addEspecialidade: (item: EspecialidadeItem) => Promise<void>; // Ajustado para Promise
  removerEspecialidade: (nome: string) => Promise<void>;
}

const STORAGE_KEY_PREFIX = "@desbravadores_progresso_";
const ProgressContext = createContext<ProgressContextData>(
  {} as ProgressContextData,
);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [concluidos, setConcluidos] = useState<RequisitoConcluido[]>([]);
  const [textosUsuario, setTextosUsuario] = useState<Record<string, string>>(
    {},
  );
  const [fotos, setFotos] = useState<Record<string, string>>({});
  const [especialidades, setEspecialidades] = useState<EspecialidadeItem[]>([]);
  const [isCarregando, setIsCarregando] = useState(true);
  const [currentUid, setCurrentUid] = useState<string | null>(
    auth.currentUser?.uid || null,
  );
  const primeiraCarga = useRef(true);
  const userStorageKey = `${STORAGE_KEY_PREFIX}${currentUid}`;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) =>
      setCurrentUid(user ? user.uid : null),
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const carregarDados = async () => {
      if (!currentUid) {
        setIsCarregando(false);
        return;
      }
      setIsCarregando(true);
      try {
        const salvoLocal = await AsyncStorage.getItem(userStorageKey);
        if (salvoLocal) {
          const { c, t, f, e } = JSON.parse(salvoLocal);
          setConcluidos(c || []);
          setTextosUsuario(t || {});
          setFotos(f || {});
          setEspecialidades(e || []);
        }

        const qEsp = query(
          collection(db, "especialidades"),
          where("userId", "==", currentUid),
        );
        const snapEsp = await getDocs(qEsp);
        const cloudEsp: EspecialidadeItem[] = [];
        snapEsp.forEach((d) =>
          cloudEsp.push({ id: d.id, ...d.data() } as EspecialidadeItem),
        );
        setEspecialidades(cloudEsp);
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setIsCarregando(false);
        primeiraCarga.current = false;
      }
    };
    carregarDados();
  }, [currentUid]);

  const syncItem = useCallback(
    async (id: string, data: any, type: "progresso" | "especialidades") => {
      if (!currentUid) return;
      const docRef = doc(db, type, id);
      await setDoc(
        docRef,
        { ...data, userId: currentUid, updatedAt: serverTimestamp() },
        { merge: true },
      );
    },
    [currentUid],
  );

  const addEspecialidade = useCallback(
    async (item: EspecialidadeItem) => {
      if (!currentUid) return;
      const docId = `${currentUid}_${item.nome.trim().replace(/\s+/g, "_").toLowerCase()}`;

      setEspecialidades((prev) => [
        ...prev.filter((e) => e.nome !== item.nome),
        { ...item, id: docId },
      ]);
      await syncItem(docId, item, "especialidades");
    },
    [currentUid, syncItem],
  );

  const removerEspecialidade = useCallback(
    async (nome: string) => {
      if (!currentUid) return;
      const docId = `${currentUid}_${nome.trim().replace(/\s+/g, "_").toLowerCase()}`;
      setEspecialidades((prev) => prev.filter((e) => e.nome !== nome));
      await deleteDoc(doc(db, "especialidades", docId));
    },
    [currentUid],
  );

  return (
    <ProgressContext.Provider
      value={{
        concluidos,
        textosUsuario,
        fotos,
        especialidades,
        isCarregando,
        addEspecialidade,
        removerEspecialidade,
        toggleRequisito: () => {},
        setTexto: () => {},
        setFoto: () => {},
        aprovarRequisito: () => {},
        desaprovarRequisito: () => {},
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
