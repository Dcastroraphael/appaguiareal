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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { auth, db, storage } from "../config/firebase";

// --- Interfaces ---
export interface RequisitoConcluido {
  id: string;
  status: "pendente" | "aprovado";
}

export interface EspecialidadeItem {
  id?: string; // Adicione o ID (opcional pois o Firestore gera depois)
  nome: string;
  categoria: string;
  userId: string;
  dataConclusao?: string; // Adicione a data (opcional)
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
  addEspecialidade: (item: EspecialidadeItem) => void;
  removerEspecialidade: (nome: string) => void;
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

  // 1. Monitor de Autenticação
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUid(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  // 2. Carga de Dados (Local + Nuvem)
  useEffect(() => {
    const carregarDados = async () => {
      if (!currentUid) {
        setConcluidos([]);
        setTextosUsuario({});
        setFotos({});
        setEspecialidades([]);
        setIsCarregando(false);
        return;
      }

      setIsCarregando(true);
      try {
        // Tenta carregar do AsyncStorage primeiro para rapidez
        const salvoLocal = await AsyncStorage.getItem(userStorageKey);
        if (salvoLocal) {
          const { c, t, f, e } = JSON.parse(salvoLocal);
          setConcluidos(c || []);
          setTextosUsuario(t || {});
          setFotos(f || {});
          setEspecialidades(e || []);
        }

        // Busca Requisitos no Firestore
        const qProgresso = query(
          collection(db, "progresso"),
          where("userId", "==", currentUid),
        );
        const snapProgresso = await getDocs(qProgresso);

        const cloudConcluidos: RequisitoConcluido[] = [];
        const cloudTextos: Record<string, string> = {};
        const cloudFotos: Record<string, string> = {};

        snapProgresso.forEach((docSnap) => {
          const d = docSnap.data();
          cloudConcluidos.push({ id: d.requisitoId, status: d.status });
          if (d.texto) cloudTextos[d.requisitoId] = d.texto;
          if (d.fotoUrl) cloudFotos[d.requisitoId] = d.fotoUrl;
        });

        // Busca Especialidades no Firestore
        const qEsp = query(
          collection(db, "especialidades"),
          where("userId", "==", currentUid),
        );
        const snapEsp = await getDocs(qEsp);
        const cloudEsp: EspecialidadeItem[] = [];
        snapEsp.forEach((d) => cloudEsp.push(d.data() as EspecialidadeItem));

        // Atualiza estados com dados da nuvem (mais recentes)
        setConcluidos(cloudConcluidos);
        setTextosUsuario(cloudTextos);
        setFotos(cloudFotos);
        setEspecialidades(cloudEsp);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsCarregando(false);
        primeiraCarga.current = false;
      }
    };

    carregarDados();
  }, [currentUid]);

  // 3. Persistência Local Automática (Debounce 1s)
  useEffect(() => {
    if (primeiraCarga.current || !currentUid) return;
    const timer = setTimeout(() => {
      AsyncStorage.setItem(
        userStorageKey,
        JSON.stringify({
          c: concluidos,
          t: textosUsuario,
          f: fotos,
          e: especialidades,
        }),
      ).catch((err) => console.error("Erro AsyncStorage:", err));
    }, 1000);
    return () => clearTimeout(timer);
  }, [concluidos, textosUsuario, fotos, especialidades]);

  // --- Helpers de Sincronização ---

  const uploadFoto = async (uri: string, requisitoId: string) => {
    if (!uri || uri.startsWith("http")) return uri;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileRef = ref(
        storage,
        `evidencias/${currentUid}/${requisitoId}.jpg`,
      );
      await uploadBytes(fileRef, blob);
      return await getDownloadURL(fileRef);
    } catch (e) {
      console.error("Erro upload:", e);
      return uri;
    }
  };

  const syncItem = useCallback(
    async (id: string, data: any, type: "progresso" | "especialidades") => {
      if (!currentUid) return;
      try {
        const docId = type === "progresso" ? `${currentUid}_${id}` : id;
        await setDoc(
          doc(db, type, docId),
          {
            ...data,
            userId: currentUid,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch (e) {
        console.error(`Erro sync ${type}:`, e);
      }
    },
    [currentUid],
  );

  // --- Ações do Contexto ---

  const toggleRequisito = useCallback(
    (id: string) => {
      const existe = concluidos.find((c) => c.id === id);
      if (existe?.status === "aprovado") return;

      if (existe) {
        setConcluidos((prev) => prev.filter((i) => i.id !== id));
        deleteDoc(doc(db, "progresso", `${currentUid}_${id}`));
      } else {
        setConcluidos((prev) => [...prev, { id, status: "pendente" }]);
        syncItem(id, { requisitoId: id, status: "pendente" }, "progresso");
      }
    },
    [concluidos, currentUid, syncItem],
  );

  const setTexto = useCallback(
    (id: string, texto: string) => {
      setTextosUsuario((prev) => ({ ...prev, [id]: texto }));
      syncItem(id, { requisitoId: id, texto }, "progresso");
    },
    [syncItem],
  );

  const setFoto = useCallback(
    async (id: string, uri: string) => {
      setFotos((prev) => ({ ...prev, [id]: uri }));
      const urlPublica = await uploadFoto(uri, id);
      syncItem(id, { requisitoId: id, fotoUrl: urlPublica }, "progresso");
    },
    [syncItem],
  );

  const addEspecialidade = useCallback(
    (item: EspecialidadeItem) => {
      setEspecialidades((prev) => {
        if (prev.find((e) => e.nome === item.nome)) return prev;
        return [...prev, item];
      });
      const docId = `${currentUid}_${item.nome.replace(/\s+/g, "_")}`;
      syncItem(docId, item, "especialidades");
    },
    [currentUid, syncItem],
  );

  const removerEspecialidade = useCallback(
    (nome: string) => {
      setEspecialidades((prev) => prev.filter((e) => e.nome !== nome));
      const docId = `${currentUid}_${nome.replace(/\s+/g, "_")}`;
      deleteDoc(doc(db, "especialidades", docId));
    },
    [currentUid],
  );

  const aprovarRequisito = useCallback(
    (id: string) => {
      setConcluidos((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "aprovado" } : i)),
      );
      syncItem(id, { status: "aprovado" }, "progresso");
    },
    [syncItem],
  );

  const desaprovarRequisito = useCallback(
    (id: string) => {
      setConcluidos((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "pendente" } : i)),
      );
      syncItem(id, { status: "pendente" }, "progresso");
    },
    [syncItem],
  );

  return (
    <ProgressContext.Provider
      value={{
        concluidos,
        textosUsuario,
        fotos,
        especialidades,
        isCarregando,
        toggleRequisito,
        setTexto,
        setFoto,
        aprovarRequisito,
        desaprovarRequisito,
        addEspecialidade,
        removerEspecialidade,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
