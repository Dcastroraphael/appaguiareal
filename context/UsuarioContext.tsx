import { doc, onSnapshot } from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../config/firebase";

// Interface atualizada para incluir campos opcionais e a data de atualização
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
  ultimaAtualizacao?: any; // CAMPO ADICIONADO PARA RESOLVER O ERRO
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
    // Escuta a mudança de autenticação
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoading(true);

        // Escuta o Firestore em tempo real
        const unsubDoc = onSnapshot(
          doc(db, "usuarios", user.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              setUsuario(docSnap.data() as Usuario);
            } else {
              console.log("Usuário não tem documento no Firestore");
              setUsuario(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Erro no Firestore:", error);
            setLoading(false);
          },
        );

        return () => unsubDoc();
      } else {
        setUsuario(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Função para atualizar o estado local imediatamente após o save
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
