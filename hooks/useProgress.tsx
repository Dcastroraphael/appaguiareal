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
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";

const ProgressContext = createContext<any>({});

export const ProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [concluidos, setConcluidos] = useState<any[]>([]);
  const user = auth.currentUser;
  const storage = getStorage();

  useEffect(() => {
    if (!user) {
      setConcluidos([]);
      return;
    }

    const q = query(
      collection(db, "progresso"),
      where("userId", "==", user.uid),
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        docId: d.id,
        ...d.data(),
      }));
      setConcluidos(data);
    });

    return () => unsub();
  }, [user]);

  const toggleRequisito = async (requisitoId: string) => {
    if (!user) return;

    // Criamos um ID de documento que mistura Usuário e Requisito para não duplicar
    const customDocId = `${user.uid}_${requisitoId}`;
    const docRef = doc(db, "progresso", customDocId);

    const jaExiste = concluidos.find((c) => c.requisitoId === requisitoId);

    if (jaExiste) {
      // Se já está aprovado, não permite desmarcar por aqui (segurança)
      if (jaExiste.status === "aprovado") return;
      await deleteDoc(docRef);
    } else {
      // SALVAMENTO CORRETO: Preenchendo os campos que estavam vazios na sua imagem
      await setDoc(docRef, {
        requisitoId: requisitoId,
        userId: user.uid,
        status: "pendente", // Entra como pendente para o diretor validar
        updatedAt: serverTimestamp(),
        fotos: [],
        resposta: "",
      });
    }
  };

  const gerenciarFoto = async (
    requisitoId: string,
    uri: string,
    acao: "add" | "remove",
  ) => {
    if (!user) return;
    const customDocId = `${user.uid}_${requisitoId}`;
    const docRef = doc(db, "progresso", customDocId);

    if (acao === "add") {
      const response = await fetch(uri);
      const blob = await response.blob();
      const sRef = ref(
        storage,
        `progresso/${user.uid}/${requisitoId}/${Date.now()}`,
      );
      await uploadBytes(sRef, blob);
      const url = await getDownloadURL(sRef);

      await setDoc(
        docRef,
        {
          requisitoId,
          userId: user.uid,
          status: "pendente",
          fotos: arrayUnion(url),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    } else {
      await updateDoc(docRef, { fotos: arrayRemove(uri) });
    }
  };

  return (
    <ProgressContext.Provider
      value={{ concluidos, toggleRequisito, gerenciarFoto }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
