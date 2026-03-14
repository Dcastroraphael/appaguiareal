import { doc, onSnapshot } from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../config/firebase";

interface Usuario {
  nome: string;
  unidade: string;
  fotoUrl: string | null;
  cargo: string;
  tipoSanguineo: string;
  endereco: string;
  email: string;
  dataNascimento: string;
  telefone: string;
  realitos: string;
  ultimaAtualizacao?: any;
}

interface UsuarioContextData {
  usuario: Usuario | null;
  loading: boolean;
  setUsuario: (dados: Usuario) => void;
  atualizarDados: (dados: Partial<Usuario>) => void;
}

const UsuarioContext = createContext<UsuarioContextData | undefined>(undefined);

export const UsuarioProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoading(true); // Trava o loading enquanto busca no banco
        const unsubDoc = onSnapshot(
          doc(db, "usuarios", user.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              setUsuario(docSnap.data() as Usuario);
            } else {
              setUsuario(null);
            }
            setLoading(false); // Destrava o loading ao terminar
          },
          (error) => {
            console.error("Erro no Firestore:", error);
            setLoading(false); // Destrava o loading mesmo se der erro
          },
        );
        return () => unsubDoc();
      } else {
        setUsuario(null);
        setLoading(false); // Destrava imediatamente se não tiver usuário
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const atualizarDados = (dados: Partial<Usuario>) => {
    setUsuario((prev) => {
      if (!prev) return null;
      return { ...prev, ...dados };
    });
  };

  return (
    <UsuarioContext.Provider
      value={{
        usuario,
        loading,
        setUsuario: (d) => setUsuario(d),
        atualizarDados,
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context)
    throw new Error("useUsuario deve ser usado dentro de um UsuarioProvider");
  return context;
};
