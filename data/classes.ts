export type Classe = {
  id: string;
  nome: string;
  cor: string;
progresso: number;
};

export const classes: Classe[] = [
  { id: "amigo", nome: "Amigo", cor: "#142fc5ff", progresso: 0.5 },
  { id: "companheiro", nome: "Companheiro", cor: "#f01b1bff", progresso: 0.2 },
  { id: "pesquisador", nome: "Pesquisador", cor: "#6ee40fff", progresso: 0.8 },
  { id: "pioneiro", nome: "Pioneiro", cor: "#433f44ff", progresso: 0.1 },
  { id: "excursionista", nome: "Excursionista", cor: "#9C27B0", progresso: 0.0 },
  { id: "guia", nome: "Guia", cor: "rgb(214, 204, 65)", progresso: 1.0 },
];