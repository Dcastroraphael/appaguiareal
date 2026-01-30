export interface Especialidade {
  id: string;
  nome: string;
}

export const especialidadesLista: Especialidade[] = [
  { id: 'flores', nome: 'Flores' },
  { id: 'cactos', nome: 'Cactos' },
  { id: 'tenis_mesa', nome: 'Tênis de Mesa' },
  { id: 'astronomia', nome: 'Astronomia' },
  { id: 'primeiros_socorros', nome: 'Primeiros Socorros' },
  // Adicione as outras do seu protótipo aqui...
];