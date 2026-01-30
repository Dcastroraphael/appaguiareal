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
  foto: string | null;
  cargo: string;
  tipoSanguineo: string;
  endereco: string;
  email: string;
  dataNascimento: string;
  telefone: string;
}

interface UsuarioContextData {
  usuario: Usuario | null; // Alterado para null inicialmente
  loading: boolean;
  setUsuario: (dados: Usuario) => void;
  atualizarDados: (dados: Partial<Usuario>) => void;
}

const UsuarioContext = createContext<UsuarioContextData | undefined>(undefined);

export const UsuarioProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null); // Inicia como null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta a mudança de autenticação
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoading(true); // Garante que está carregando ao detectar usuário

        // Escuta o Firestore
        const unsubDoc = onSnapshot(
          doc(db, "usuarios", user.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              setUsuario(docSnap.data() as Usuario);
            } else {
              console.log("Usuário não tem documento no Firestore");
              setUsuario(null);
            }
            setLoading(false); // PARA O GIRANDO AQUI
          },
          (error) => {
            console.error("Erro no Firestore:", error);
            setLoading(false); // PARA O GIRANDO MESMO COM ERRO
          },
        );

        return () => unsubDoc();
      } else {
        setUsuario(null);
        setLoading(false); // PARA O GIRANDO SE NÃO HOUVER USER
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const atualizarDados = (dados: Partial<Usuario>) => {
    if (usuario) {
      setUsuario({ ...usuario, ...dados });
    }
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
