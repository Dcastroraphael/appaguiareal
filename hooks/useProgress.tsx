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
  useState
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
  especialidades: EspecialidadeItem[];
  isCarregando: boolean;
  toggleRequisito: (id: string) => Promise<void>;
  addEspecialidade: (item: EspecialidadeItem) => Promise<void>;
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
  const [especialidades, setEspecialidades] = useState<EspecialidadeItem[]>([]);
  const [isCarregando, setIsCarregando] = useState(true);
  const [currentUid, setCurrentUid] = useState<string | null>(
    auth.currentUser?.uid || null,
  );
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
        setConcluidos([]);
        setEspecialidades([]);
        setIsCarregando(false);
        return;
      }
      setIsCarregando(true);
      try {
        const salvoLocal = await AsyncStorage.getItem(userStorageKey);
        if (salvoLocal) {
          const { c, e } = JSON.parse(salvoLocal);
          setConcluidos(c || []);
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

        const qProg = query(
          collection(db, "progresso"),
          where("userId", "==", currentUid),
        );
        const snapProg = await getDocs(qProg);
        const cloudProg: RequisitoConcluido[] = [];
        snapProg.forEach((d) => {
          const data = d.data();
          cloudProg.push({ id: data.requisitoId, status: data.status });
        });

        setEspecialidades(cloudEsp);
        setConcluidos(cloudProg);
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setIsCarregando(false);
      }
    };
    carregarDados();
  }, [currentUid]);

  const syncItem = useCallback(
    async (id: string, data: any, type: "progresso" | "especialidades") => {
      if (!currentUid) return;
      const docId = type === "progresso" ? `${currentUid}_${id}` : id;
      await setDoc(
        doc(db, type, docId),
        { ...data, userId: currentUid, updatedAt: serverTimestamp() },
        { merge: true },
      );
    },
    [currentUid],
  );

  const toggleRequisito = useCallback(
    async (id: string) => {
      if (!currentUid) return;
      const existe = concluidos.find((c) => c.id === id);
      if (existe?.status === "aprovado") return;

      if (existe) {
        setConcluidos((prev) => prev.filter((i) => i.id !== id));
        await deleteDoc(doc(db, "progresso", `${currentUid}_${id}`));
      } else {
        setConcluidos((prev) => [...prev, { id, status: "pendente" }]);
        await syncItem(
          id,
          { requisitoId: id, status: "pendente" },
          "progresso",
        );
      }
    },
    [concluidos, currentUid, syncItem],
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
        especialidades,
        isCarregando,
        toggleRequisito,
        addEspecialidade,
        removerEspecialidade,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
