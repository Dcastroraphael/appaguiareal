interface RequisitoItem {
  id: string;
  texto: string;
  concluido: boolean;
  permiteTexto?: boolean;
  somenteTexto?: boolean;
}

interface Categoria {
  categoria: string;
  itens: RequisitoItem[];
}

// 2. DADOS (Aqui usamos DOIS-PONTOS, VÍRGULAS e VALORES REAIS)
export const amigo = [
  {
    categoria: "I - Requisitos Gerais",
    itens: [
      {
        id: "am_geral_1",
        texto: "Ter pelo menos 10 anos de idade",
        concluido: false,
      },
      {
        id: "am_geral_2",
        texto: "Ser membro ativo do Clube",
        concluido: false,
      },
      {
        id: "am_geral_3",
        texto: "Memorizar e explicar o Voto e a Lei",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_geral_4",
        texto: "Ler o livro do Clube do livro Juvenil do ano em curso.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_geral_5",
        texto: "Ler o livro 'Vaso de barro'.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_geral_6",
        texto: "Participar ativamente da classe bíblica do seu clube.",
        concluido: false,
      },
    ],
  },
  {
    categoria: "II - Descoberta Espiritual",
    itens: [
      {
        id: "am_esp_1",
        texto: "Memorizar e demonstrar seu conhecimento:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "am_esp_1a",
        texto: "a- Criação: o que Deus criou em cada dia da Criação.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_esp_1b",
        texto: "b- 10 pragas: quais as pragas que caíram sobre o Egito.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_esp_1c",
        texto: "c- 12 Tribos: o nome de cada uma das 12 tribos de Israel.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_esp_1d",
        texto:
          "d- 39 livros do Antigo Testamento e demonstre habilidade para encontrar qualquer um deles.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_esp_2",
        texto: "Ler e explicar os versos abaixo:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "am_esp_2a",
        texto: "a- João 3:16",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_esp_2b",
        texto: "b- Efésios 6:1-3",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_esp_2c",
        texto: "c- II Timóteo 3:16",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_esp_2d",
        texto: "d- Salmo 1",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_esp_3",
        texto: "Leitura Bíblica:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "am_esp_3a",
        texto:
          "a- Gênesis: 1, 2, 3, 4:1-16, 6:11-22, 7, 8, 9:1-19, 11:1-9, 12:1-10, 13, 14:18-24, 15, 17:1-8; 15-22, 18:1-15, 18: 16-33, 19:1-29, 21:1-21, 22:1-19, 23, 24:1-46, 48, 24:52-67, 27, 28, 29, 30:25-31; 31:2-3, 17-18, 32, 33, 37, 40, 41, 42, 43, 44, 45, 47, 50",
        concluido: false,
      },
      {
        id: "am_esp_3b",
        texto:
          "b- Êxodo: 1, 2, 3, 4:1-17; 27-31, 5, 7, 8, 9, 10; 11, 12, 13:17-22; 14, 15:22-27; 16, 17, 18, 19, 20, 24, 32, 33, 34:1-14; 29-35, 35:4-29 e 40",
        concluido: false,
      },
    ],
  },
  {
    categoria: "III - Servindo a Outros",
    itens: [
      {
        id: "am_out_1",
        texto:
          "Dedicar duas horas ajudando alguém em sua comunidade, através de duas das seguintes atividades:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "am_out_1a",
        texto:
          "a- Visitar alguém que precisa de amizade e orar com essa pessoa.",
        concluido: false,
      },
      {
        id: "am_out_1b",
        texto: "b- Oferecer alimento a alguém carente.",
        concluido: false,
      },
      {
        id: "am_out_1c",
        texto: "c- Participar de um projeto ecológico ou educativo.",
        concluido: false,
      },
      {
        id: "am_out_2",
        texto:
          "Escrever uma redação explicando como ser um bom cidadão no lar e na escola.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "IV - Desenvolvendo Amizade",
    itens: [
      {
        id: "am_des_1",
        texto:
          "Mencionar dez qualidades de um bom amigo e apresentar quatro situações diárias onde você praticou a Regra Áurea de Mateus 7:12.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_des_2",
        texto:
          "Saber cantar o Hino Nacional de seu país e conhecer sua história. Saber o nome do autor da letra e da música do hino.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "V - Saúde e Aptidão Física",
    itens: [
      {
        id: "am_saf_1",
        texto: "Completar uma das seguintes especialidades:",
        somenteTexto: true,
        concluido: false,
      },
      { id: "am_saf_1a", texto: "a- Natação principiante I", concluido: false },
      { id: "am_saf_1b", texto: "b- Cultura física", concluido: false },
      { id: "am_saf_1c", texto: "c- Nós e amarras", concluido: false },
      {
        id: "am_saf_1d",
        texto: "d- Segurança básica na água",
        concluido: false,
      },
      {
        id: "am_saf_2",
        texto: "Utilizando a experiência de Daniel:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "am_saf_2a",
        texto:
          "a- Explicar os princípios de temperança que ele defendeu ou participar em uma apresentação ou encenação sobre Daniel 1.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_saf_2b",
        texto: "b- Memorizar e explicar Daniel 1:8.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_saf_2c",
        texto:
          "c- Escrever seu compromisso pessoal de seguir um estilo de vida saudável.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_saf_3",
        texto:
          "Aprender os princípios de uma dieta saudável e ajudar a preparar um quadro com os grupos básicos de alimentos.",
        concluido: false,
      },
    ],
  },
  {
    categoria: "VI - Organização e Liderança",
    itens: [
      {
        id: "am_oli_1",
        texto:
          "Através da observação, acompanhar todo o processo de planejamento até a execução de uma caminhada de 5 quilômetros.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "VII - Estudo da Natureza",
    itens: [
      {
        id: "am_esn_1",
        texto: "Completar uma das seguintes especialidades:",
        somenteTexto: true,
        concluido: false,
      },
      { id: "am_esn_1a", texto: "a- Felinos", concluido: false },
      { id: "am_esn_1b", texto: "b- Cães", concluido: false },
      { id: "am_esn_1c", texto: "c- Mamíferos", concluido: false },
      { id: "am_esn_1d", texto: "d- Sementes", concluido: false },
      { id: "am_esn_1e", texto: "e- Aves de estimação", concluido: false },
      {
        id: "am_esn_2",
        texto:
          "Aprender e demonstrar uma maneira para purificar a água e escrever um parágrafo destacando o significado de Jesus como a água da vida.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_esn_3",
        texto:
          "Aprender e montar três diferentes tipos de barracas em locais apropriados.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "VIII - Arte de Acampar",
    itens: [
      {
        id: "am_aac_1",
        texto:
          "Demonstrar como cuidar corretamente de uma corda. Fazer e explicar o uso prático dos seguintes nós:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1a",
        texto: "a- Simples",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1b",
        texto: "b- Cego",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1c",
        texto: "c- Direito",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1d",
        texto: "d- Cirurgião",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1e",
        texto: "e- Lais de guia",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1f",
        texto: "f- Lais de guia duplo",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1g",
        texto: "g- Escota",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1h",
        texto: "h- Catau",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1i",
        texto: "i- Pescador",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1j",
        texto: "j- Fateixa",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1k",
        texto: "k- Volta do fiel",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1l",
        texto: "l- Nó de gancho",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1m",
        texto: "m- Volta do ribeira",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_1n",
        texto: "n- Ordinário",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_2",
        texto: "Completar a especialidade de Acampamento I.",
        concluido: false,
      },
      {
        id: "am_aac_3",
        texto:
          "Apresentar 10 regras para uma caminhada e explicar o que fazer quando estiver perdido.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "am_aac_4",
        texto:
          "Aprender os sinais para seguir uma pista. Preparar e seguir uma pista de no mínimo 10 sinais, que também possa ser seguida por outros.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "IX - Estilo de Vida",
    itens: [
      {
        id: "am_esv_1",
        texto:
          "Completar uma especialidade na área de Artes e Habilidades Manuais.",
        concluido: false,
      },
    ],
  },
];

export const companheiro: Categoria[] = [
  {
    categoria: "I - Requisitos Gerais",
    itens: [
      {
        id: "com_geral_1",
        texto: "Ter pelo menos 11 anos de idade",
        concluido: false,
      },
      {
        id: "com_geral_2",
        texto: "Ser membro ativo do Clube",
        concluido: false,
      },
      {
        id: "com_geral_3",
        texto:
          "Ilustrar de forma criativa o significado do Voto dos Desbravadores.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_geral_4",
        texto:
          "Ler o livro do Clube do Livro Juvenil do ano em curso e escrever um parágrafo sobre o que mais lhe chamou a atenção ou considerou importante.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_geral_5",
        texto: "Ler o livro 'Um simples lanche'.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_geral_6",
        texto: "Participar ativamente da classe bíblica do seu clube.",
        concluido: false,
      },
    ],
  },
  {
    categoria: "II - Descoberta Espiritual",
    itens: [
      {
        id: "com_esp_1",
        texto: "Memorizar e demonstrar seu conhecimento:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_1a",
        texto: "a- 10 Mandamentos: A Lei de Deus dada a Moisés.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_1b",
        texto:
          "b- 27 livros do Novo Testamento e demonstrar habilidade para encontrar qualquer um deles.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_2",
        texto: "Ler e explicar os versos abaixo:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_2a",
        texto: "Isa. 41:9-10",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_2b",
        texto: "Heb. 13:5",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_2c",
        texto: "Prov. 22:6",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_2d",
        texto: "I João 1:9",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_2e",
        texto: "Salmo 8",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_3",
        texto: "Leitura Bíblica:",
        somenteTexto: true,
        concluido: false,
      },
      { id: "com_esp_3a", texto: "Levítico: 11", concluido: false },
      {
        id: "com_esp_3b",
        texto:
          "Números: 9: 15-23, 11, 12, 13, 14:1-38, 16, 17, 20:1-13; 22-29, 21:4-9, 22, 23; 24:1-10",
        concluido: false,
      },
      {
        id: "com_esp_3c",
        texto: "Deuteronômio: 1:1-17, 32:1-43, 33, 34",
        concluido: false,
      },
      {
        id: "com_esp_3d",
        texto: "Josué: 1, 2, 3, 4, 5:10; 6, 7, 9, 24:1-15; 29",
        concluido: false,
      },
      {
        id: "com_esp_3e",
        texto: "Juízes: 6, 7, 13:1-18; 14, 15, 16",
        concluido: false,
      },
      { id: "com_esp_3f", texto: "Rute: 1, 2; 3, 4", concluido: false },
      {
        id: "com_esp_3g",
        texto:
          "1 Samuel: 1, 2, 3, 4, 5, 6, 8, 9, 10; 11:12-15, 12, 13, 15, 16, 17, 18:1-19, 20, 21:1-7; 22, 24, 25, 26, 31",
        concluido: false,
      },
      {
        id: "com_esp_3h",
        texto: "2 Samuel: 1, 5, 6, 7, 9, 11; 12:1-25, 15, 18",
        concluido: false,
      },
      {
        id: "com_esp_4",
        texto:
          "Em consulta com o seu conselheiro, escolher um dos seguintes temas:",
        somenteTexto: true,
        concluido: false,
      },
      { id: "com_esp_4a", texto: "Uma parábola de Jesus", concluido: false },
      { id: "com_esp_4b", texto: "Um milagre de Jesus", concluido: false },
      { id: "com_esp_4c", texto: "O sermão da montanha", concluido: false },
      {
        id: "com_esp_4d",
        texto: "Um sermão sobre a Segunda Vinda de Cristo",
        concluido: false,
      },
      {
        id: "com_esp_4txt",
        texto:
          "Escolher um item abaixo para demonstrar seu conhecimento sobre o tema escolhido: ",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_4e",
        texto: "Troca de ideias com seu conselheiro",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_4f",
        texto: "Atividade que integre todo o grupo",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_esp_4g",
        texto: "Redação",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "III - Servindo a Outros",
    itens: [
      {
        id: "com_out_1",
        texto:
          "Planejar e dedicar pelo menos duas horas servindo sua comunidade e demonstrando companheirismo para alguém, de maneira prática.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_out_2",
        texto:
          "Dedicar pelo menos cinco horas participando de um projeto que beneficiará sua comunidade ou igreja.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "IV - Desenvolvendo Amizade",
    itens: [
      {
        id: "com_des_1",
        texto:
          "Conversar com seu conselheiro ou unidade sobre como respeitar pessoas de diferentes culturas, raça e sexo.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "V - Saúde e Aptidão Física",
    itens: [
      {
        id: "com_saf_1",
        texto: "Memorizar e explicar I Coríntios 9:24-27.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_saf_2",
        texto:
          "Conversar com seu líder sobre a aptidão física e os exercícios físicos regulares que se relacionam com uma vida saudável.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_saf_3",
        texto:
          "Aprender sobre os prejuízos que o cigarro causa à saúde e escrever seu compromisso de não fazer uso do fumo.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_saf_4",
        texto: "Completar uma das seguintes especialidades:",
        somenteTexto: true,
        concluido: false,
      },
      { id: "com_saf_4a", texto: "Natação Principiante II", concluido: false },
      { id: "com_saf_4b", texto: "Acampamento II", concluido: false },
    ],
  },
  {
    categoria: "VI - Organização e Liderança",
    itens: [
      {
        id: "com_oli_1",
        texto:
          "Dirigir ou colaborar em uma meditação criativa para a sua unidade ou Clube.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_oli_2",
        texto:
          "Ajudar no planejamento de uma excursão ou acampamento com sua unidade ou clube, envolvendo pelo menos um pernoite.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "VII - Estudo da Natureza",
    itens: [
      {
        id: "com_esn_1",
        texto:
          "Participar de jogos da natureza, ou caminhada ecológica em meio a natureza, pelo período de uma hora.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_esn_2",
        texto: "Completar duas das seguintes especialidades: ",
        somenteTexto: true,
        concluido: false,
      },
      { id: "com_esn_2a", texto: "Anfíbios", concluido: false },
      { id: "com_esn_2b", texto: "Aves", concluido: false },
      { id: "com_esn_2c", texto: "Aves domésticas", concluido: false },
      { id: "com_esn_2d", texto: "Pecuária", concluido: false },
      { id: "com_esn_2e", texto: "Répteis", concluido: false },
      { id: "com_esn_2f", texto: "Moluscos", concluido: false },
      { id: "com_esn_2g", texto: "Árvores", concluido: false },
      { id: "com_esn_2h", texto: "Arbustos", concluido: false },
      {
        id: "com_esn_3",
        texto:
          "Recapitular o estudo da criação e fazer um diário por sete dias registrando suas observações do que foi criado em cada dia correspondente.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "VIII - Arte de Acampar",
    itens: [
      {
        id: "com_aac_1",
        texto:
          "Descobrir os pontos cardeais sem a ajuda de uma bússola e desenhar uma Rosa dos Ventos.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_aac_2",
        texto:
          "Participar em um acampamento de final de semana, e fazer um relatório destacando o que mais lhe impressionou positivamente.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "com_aac_3",
        texto: "Aprender ou recapitular os seguintes nós:",
        somenteTexto: true,
        concluido: false,
      },
      { id: "com_aac_3a", texto: "Oito", concluido: false },
      { id: "com_aac_3b", texto: "Volta do salteador", concluido: false },
      { id: "com_aac_3c", texto: "Duplo", concluido: false },
      { id: "com_aac_3d", texto: "Caminhoneiro", concluido: false },
      { id: "com_aac_3e", texto: "Direito", concluido: false },
      { id: "com_aac_3f", texto: "Volta do fiel", concluido: false },
      { id: "com_aac_3g", texto: "Escota", concluido: false },
      { id: "com_aac_3h", texto: "Lais de guia", concluido: false },
      { id: "com_aac_3i", texto: "Simples", concluido: false },
    ],
  },
  {
    categoria: "IX - Estilo de Vida",
    itens: [
      {
        id: "com_esv_1",
        texto:
          "Completar uma especialidade não realizada anteriormente. Na seção de Artes e Habilidades Manuais.",
        concluido: false,
      },
    ],
  },
];

export const pesquisador: Categoria[] = [
  {
    categoria: "I - Requisitos Gerais",
    itens: [
      {
        id: "pes_geral_1",
        texto: "Ter, no mínimo, 12 anos de idade.",
        concluido: false,
      },
      {
        id: "pes_geral_2",
        texto: "Ser membro ativo do Clube de Desbravadores",
        concluido: false,
      },
      {
        id: "pes_geral_3",
        texto:
          "Demonstrar sua compreensão do significado da Lei do Desbravador através de uma das seguintes atividades:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pes_geral_3a",
        texto: "Representação",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_geral_3b",
        texto: "Debate",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_geral_3c",
        texto: "Redação",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_geral_4",
        texto:
          "Ler o livro do Clube do Livro Juvenil do ano e escrever dois parágrafos sobre o que mais lhe chamou a atenção ou considerou importante.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_geral_5",
        texto: "Ler o livro 'Além da Magia'.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_geral_6",
        texto: "Participar ativamente da classe bíblica do seu clube.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "II - Descoberta Espiritual",
    itens: [
      {
        id: "pes_esp1",
        texto: "Memorizar e demonstrar seu conhecimento: ",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_1a",
        texto:
          "Levítico 11: quais as regras para os alimentos considerados comestíveis e não comestíveis.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_2",
        texto: "Ler e explicar os versos abaixo: ",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_2a",
        texto: "Ecles. 12:13-14",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_2b",
        texto: "Rom. 6:23",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_2c",
        texto: "Apoc. 1:3",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_2d",
        texto: "Isa. 43:1-2",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_2e",
        texto: "Salmo 51:10",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_2f",
        texto: "Salmo 16",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_3",
        texto: "Leitura Bíblica",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_3a",
        texto:
          "1 Reis: 1:28-53, 3, 4:20-34, 5, 6, 8:12-60, 10, 11:6-43, 12, 16:29-33",
        concluido: false,
      },
      {
        id: "pes_esp_3b",
        texto: "2 Reis: 2, 4, 5, 6, 9, 17:1-23, 18, 19, 20:1-11, 25:1-30",
        concluido: false,
      },
      { id: "pes_esp_3c", texto: "2 Crônicas: 24:1-14, 36", concluido: false },
      { id: "pes_esp_3d", texto: "Esdras: 1, 3; 6:14-15", concluido: false },
      { id: "pes_esp_3e", texto: "Neemias: 1, 2, 4, 8", concluido: false },
      {
        id: "pes_esp_3f",
        texto: "Ester: 1, 2, 3, 4, 5, 6, 7; 8",
        concluido: false,
      },
      { id: "pes_esp_3g", texto: "Jó: 1, 2, 42", concluido: false },
      {
        id: "pes_esp_3h",
        texto:
          "Salmos: 1, 15, 19, 23, 24, 27, 37, 39, 42, 46, 67, 90; 91, 92; 97, 98, 100, 117, 119:1-80, 119:81-176, 121, 125, 150",
        concluido: false,
      },
      {
        id: "pes_esp_3i",
        texto: "Provérbios: 1, 3, 4, 10, 15, 20, 25",
        concluido: false,
      },
      { id: "pes_esp_3j", texto: "Eclesiastes: 1", concluido: false },
      {
        id: "pes_esp_4",
        texto:
          "Conversar com seu líder e escolher uma das seguintes histórias:",
        somenteTexto: true,
        concluido: false,
      },
      { id: "pes_esp_4a", texto: "João 3 - Nicodemos", concluido: false },
      {
        id: "pes_esp_4b",
        texto: "João 4 - A mulher samaritana",
        concluido: false,
      },
      {
        id: "pes_esp_4c",
        texto: "Lucas 10 - O bom samaritano",
        concluido: false,
      },
      {
        id: "pes_esp_4d",
        texto: "Lucas 15 - O filho pródigo",
        concluido: false,
      },
      { id: "pes_esp_4e", texto: "Lucas 19 - Zaqueu", concluido: false },
      {
        id: "pes_esp_4txt",
        texto:
          "Através da história escolhida, demonstrar sua compreensão em como Jesus salva as pessoas, usando um dos seguintes métodos abaixo: ",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_4f",
        texto: "Conversar em grupo com a participação de seu líder.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_4g",
        texto: "Apresentar uma mensagem em uma reunião do clube.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_4h",
        texto: "Fazer uma série de cartazes ou uma maquete.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esp_4i",
        texto: "Escrever uma poesia ou hino.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "III - Servindo a Outros",
    itens: [
      {
        id: "pes_out_1",
        texto:
          "Conhecer os projetos comunitários desenvolvidos em sua cidade e participar em pelo menos um deles com sua unidade ou clube.",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pes_out_2",
        texto: "Participar em três atividades missionárias da igreja.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "IV - Desenvolvendo Amizade",
    itens: [
      {
        id: "pes_des_1",
        texto:
          "Participar de um debate ou representação sobre a pressão de grupo e identificar a influência que isso exerce sobre suas decisões.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_des_2",
        texto:
          "Visitar um órgão público de sua cidade e descobrir de que maneiras o clube pode ser útil à sua comunidade.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "V - Saúde e Aptidão Física",
    itens: [
      {
        id: "pes_saf_1",
        texto:
          "Escolher uma das atividades abaixo e escrever um texto pessoal para um estilo de vida livre do álcool: ",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pes_saf_1a",
        texto:
          "Participar de uma discussão em classe sobre os efeitos do álcool no organismo.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_saf_1b",
        texto:
          "Assistir a um vídeo sobre o álcool ou outras drogas no corpo humano e conversar sobre o assunto.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "VI - Organização e Liderança",
    itens: [
      {
        id: "pes_oli_1",
        texto:
          "Dirigir uma cerimônia de abertura da reunião semanal em seu clube ou um programa de Escola Sabatina.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_oli_2",
        texto: "Ajudar a organizar a classe bíblica de seu clube.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "VII - Estudo da Natureza",
    itens: [
      {
        id: "pes_esn_1",
        texto:
          "Identificar a estrela Alfa da constelação do Centauro e a constelação de Órion. Conhecer o significado espiritual de Órion, como descrito no livro 'Primeiros Escritos', de Ellen White, pág. 41.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_esn_2",
        texto: "Completar uma das especialidades abaixo: ",
        somenteTexto: true,
        concluido: false,
      },
      { id: "pes_esn_2a", texto: "Astronomia", concluido: false },
      { id: "pes_esn_2b", texto: "Cactos", concluido: false },
      { id: "pes_esn_2c", texto: "Climatologia", concluido: false },
      { id: "pes_esn_2d", texto: "Flores", concluido: false },
      { id: "pes_esn_2e", texto: "Rastreio de animais", concluido: false },
    ],
  },
  {
    categoria: "VIII - Arte de Acampar",
    itens: [
      {
        id: "pes_aac_1",
        texto:
          "Apresentar seis segredos para um bom acampamento. Participar de um acampamento de final de semana, planejando e cozinhando duas refeições.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pes_aac_2",
        texto: "Completar as seguintes especialidades: ",
        somenteTexto: true,
        concluido: false,
      },
      { id: "pes_aac_2a", texto: "Acampamento III", concluido: false },
      {
        id: "pes_aac_2b",
        texto: "Primeiros Socorros - básico",
        concluido: false,
      },
      {
        id: "pes_aac_3",
        texto:
          "Aprender a usar uma bússola ou GPS (urbano ou campo), e demonstrar sua habilidade encontrando endereços em uma zona urbana.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "IX - Estilo de Vida",
    itens: [
      {
        id: "pes_esv_1",
        texto:
          "Completar uma especialidade não realizada anteriormente, em Artes e Habilidades Manuais.",
        concluido: false,
      },
    ],
  },
];

export const pioneiro: Categoria[] = [
  {
    categoria: "I - Requisitos Gerais",
    itens: [
      {
        id: "pio_gerais_1",
        texto: "Ter, no mínimo, 13 anos de idade.",
        concluido: false,
      },
      {
        id: "pio_gerais_2",
        texto: "Ser membro ativo do Clube de Desbravadores.",
        concluido: false,
      },
      {
        id: "pio_gerais_3",
        texto: "Memorizar e entender o Alvo e o Lema JA.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_gerais_4",
        texto:
          "Ler o livro do Clube do Livro Juvenil do ano em curso e resumi-lo em uma página.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_gerais_5",
        texto: "Ler o livro 'Expedição Galápagos'.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "II - Descoberta Espiritual",
    itens: [
      {
        id: "pio_esp_1",
        texto: "Memorizar e demonstrar seu conhecimento:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_1a",
        texto: "Bem-Aventuranças: O sermão da Montanha",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_2",
        texto: "Ler e explicar os versos abaixo: ",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_2a",
        texto: "Isa. 26:3",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_2b",
        texto: "Rom. 12:12",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_2c",
        texto: "João 14:1-3",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_2d",
        texto: "Sal. 37:5",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_2e",
        texto: "Filip. 3:12-14",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_2f",
        texto: "Salmo 23",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_2g",
        texto: "I Sam. 15:22",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_3",
        texto: "Conversar em seu clube ou unidade sobre: ",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_3a",
        texto: "O que é o cristianismo",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_3b",
        texto: "Quais são as características de um verdadeiro discípulo",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_3c",
        texto: "O que fazer para ser um cristão verdadeiro",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_4",
        texto:
          "Participar de um estudo especial sobre a inspiração da Bíblia, com a ajuda de um pastor, trabalhando os conceitos de inspiração, revelação e iluminação.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_5",
        texto:
          "Convidar três ou mais pessoas para assistirem uma classe bíblica ou pequeno grupo.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_6",
        texto: "Leitura bíblica: ",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esp_6a",
        texto: "Eclesiastes: 3, 5, 7, 11; 12",
        concluido: false,
      },
      {
        id: "pio_esp_6b",
        texto: "Isaías: 5, 11, 26:1-12; 35, 40, 43, 52:13-15; 53, 58, 60, 61",
        concluido: false,
      },
      {
        id: "pio_esp_6c",
        texto: "Jeremias: 9:23-26, 10:1-16, 18:1-6, 26, 36, 52:1-11",
        concluido: false,
      },
      {
        id: "pio_esp_6d",
        texto: "Daniel: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12",
        concluido: false,
      },
      { id: "pio_esp_6e", texto: "Joel: 2:12-31", concluido: false },
      { id: "pio_esp_6f", texto: "Amós: 7:10-16; 8:4-11", concluido: false },
      { id: "pio_esp_6g", texto: "Jonas: 1, 2, 3; 4", concluido: false },
      { id: "pio_esp_6h", texto: "Miqueias: 4", concluido: false },
      { id: "pio_esp_6i", texto: "Ageu: 2", concluido: false },
      { id: "pio_esp_6j", texto: "Zacarias: 4", concluido: false },
      { id: "pio_esp_6k", texto: "Malaquias: 3; 4", concluido: false },
      {
        id: "pio_esp_6l",
        texto:
          "Mateus: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23",
        concluido: false,
      },
    ],
  },
  {
    categoria: "III - Servindo a Outros",
    itens: [
      {
        id: "pio_out_1",
        texto:
          "Participar em dois projetos missionários definidos por seu clube.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_out_2",
        texto:
          "Trabalhar em um projeto comunitário de sua igreja, escola ou comunidade.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "IV - Desenvolvendo Amizade",
    itens: [
      {
        id: "pio_des_1",
        texto:
          "Participar de um debate e fazer uma avaliação pessoal sobre suas atitudes em dois dos seguintes temas:",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_des_1a",
        texto: "Auto-estima",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pio_des_1b",
        texto: "Amizade",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pio_des_1c",
        texto: "Relacionamentos",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pio_des_1d",
        texto: "Otimismo e pessimismo",
        somenteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "V - Saúde e Aptidão Física",
    itens: [
      {
        id: "pio_saf_1",
        texto:
          "Preparar um programa pessoal de exercícios físicos diários e conversar com seu líder ou conselheiro sobre os princípios de aptidão física. Fazer e assinar um compromisso pessoal de realizar exercícios físicos regularmente.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_saf_2",
        texto:
          "Discutir as vantagens do estilo de vida Adventista de acordo com o que a Bíblia ensina.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "VI - Organização e Liderança",
    itens: [
      {
        id: "pio_oli_1",
        texto:
          "Assistir a um seminário ou treinamento, oferecido pela sua igreja ou distrito nos departamentos abaixo:",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_oli_1a",
        texto: "Ministério Pessoal",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pio_oli_1b",
        texto: "Evangelismo",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pio_oli_2",
        texto: "Participar de uma atividade social de sua igreja.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "VII - Estudo da Natureza",
    itens: [
      {
        id: "pio_esn_1",
        texto: "Estudar a história do dilúvio e o processo de fossilização.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esn_2",
        texto:
          "Completar uma especialidade, não realizada anteriormente, em Estudos da Natureza.",
        concluido: false,
      },
    ],
  },
  {
    categoria: "VIII - Arte de Acampar",
    itens: [
      {
        id: "pio_aac_1",
        texto: "Fazer um fogo refletor e demonstrar seu uso.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_aac_2",
        texto:
          "Participar de um acampamento de final de semana, arrumando de forma apropriada sua bolsa ou mochila com o equipamento pessoal necessário.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "pio_aac_3",
        texto: "Completar a especialidade de Resgate básico.",
        concluido: false,
      },
    ],
  },
  {
    categoria: "IX - Estilo de Vida",
    itens: [
      {
        id: "pio_esv_1",
        texto:
          "Completar uma especialidade não realizada anteriormente em uma das seguintes áreas:",
        concluido: false,
      },
      {
        id: "pio_esv_1a",
        texto: "Atividades Missionárias",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esv_1b",
        texto: "Atividades Profissionais",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "pio_esv_1c",
        texto: "Atividades Agrícolas",
        somenteTexto: true,
        concluido: false,
      },
    ],
  },
];

export const excursionista: Categoria[] = [
  {
    categoria: "I - Requisitos Gerais",
    itens: [
      {
        id: "exc_ger_1",
        texto: "Ter, no mínimo, 14 anos de idade.",
        concluido: false,
      },
      {
        id: "exc_ger_2",
        texto: "Ser membro ativo do Clube de Desbravadores.",
        concluido: false,
      },
      {
        id: "exc_ger_3",
        texto: "Memorizar e explicar o significado do Objetivo JA.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_ger_4",
        texto:
          "Ler o livro do Clube do Livro Juvenil do ano em curso e resumi-lo em uma página.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_ger_5",
        texto: "Ler o livro 'O Fim do Começo'.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "II - Descoberta Espiritual",
    itens: [
      {
        id: "exc_esp_1",
        texto: "Memorizar e demonstrar o seu conhecimento: ",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_1a",
        texto: "12 Apóstolos: O nome do 12 apóstolos de Cristo",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_1b",
        texto:
          "Frutos do Espírito: A relação dos adjetivos do caráter do cristão",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_2",
        texto: "Ler e explicar os versos abaixo:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_2a",
        texto: "Rom. 8:28",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_2b",
        texto: "Apoc. 21:1-3",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_2c",
        texto: "II Ped. 1:20-21",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_2d",
        texto: "I João 2:14",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_2e",
        texto: "II Cro. 20:20",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_2f",
        texto: "Salmo 46",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_3",
        texto:
          "Estudar e entender a pessoa do Espírito Santo, como Ele se relaciona, e qual o Seu papel no crescimento espiritual de cada ser humano.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_4",
        texto:
          "Estude, com sua unidade, os eventos finais e a segunda vinda de Cristo.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_5",
        texto:
          "Através do estudo da Bíblia, descobrir o verdadeiro significado da observância do sábado.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_6",
        texto: "Leitura bíblica:",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esp_6a",
        texto:
          "Mateus: 24, 25, 26:1-35, 26:36-75, 27:1-31, 27:32-56, 27:57-66, 28",
        concluido: false,
      },
      {
        id: "exc_esp_6b",
        texto: "Marcos: 7, 9, 10, 11, 12, 16,",
        concluido: false,
      },
      {
        id: "exc_esp_6c",
        texto:
          "Lucas: 1:4-25, 1:26-66, 2:21-38, 2:39-52, 7:18-28, 8, 10:1-37, 10:38-42; 11:1-13, 12, 13, 14, 15, 16:1-17, 17, 18, 19, 21, 22, 23, 24",
        concluido: false,
      },
      {
        id: "exc_esp_6d",
        texto:
          "João: 1, 2, 3, 4, 5, 6:1-21, 6:22-71, 8:1-38, 9, 10, 11:1-46, 12, 13, 14, 15, 17, 18, 19, 20, 21",
        concluido: false,
      },
      {
        id: "exc_esp_6e",
        texto: "Atos: 1, 2, 3, 4, 5, 6, 7, 8",
        concluido: false,
      },
    ],
  },
  {
    categoria: "III - Servindo a Outros",
    itens: [
      {
        id: "exc_out_1",
        texto:
          "Convidar um amigo para participar de uma atividade social de sua igreja ou da Associação/Missão.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_out_2",
        texto:
          "Participar de um projeto comunitário desde o planejamento, organização até a execução.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_out_3",
        texto:
          "Discutir como os jovens adventistas devem se relacionar com as pessoas nas diferentes situações do dia a dia, tais como: ",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_out_3a",
        texto: "Vizinhos",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_out_3b",
        texto: "Escola",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_out_3c",
        texto: "Atividades sociais",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_out_3d",
        texto: "Atividades recreativas",
        somenteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "IV - Desenvolvendo Amizade",
    itens: [
      {
        id: "exc_des_1",
        texto:
          "Através de uma conversa em grupo ou avaliação pessoal, examinar suas atitudes em dois dos seguintes temas:",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_des_1a",
        texto: "Auto-estima",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_des_1b",
        texto: "Relacionamento familiar",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_des_1c",
        texto: "Finanças pessoais",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_des_1d",
        texto: "Pressão de grupo",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_des_2",
        texto:
          "Preparar uma lista contendo cinco sugestões de atividades recreativas para ajudar pessoas com necessidades específicas e colaborar na organização de uma dessas atividades para essas pessoas.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "V - Saúde e Aptidão Física",
    itens: [
      {
        id: "exc_saf_1",
        texto: "Completar a especialidade de Temperança.",
        concluido: false,
      },
    ],
  },
  {
    categoria: "VI - Organização e Liderança",
    itens: [
      {
        id: "exc_oli_1",
        texto:
          "Preparar um organograma da igreja local e relacionar as funções dos departamentos.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_oli_2",
        texto:
          "Participar em dois programas envolvendo diferentes departamentos da igreja local.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_oli_3",
        texto: "Completar a especialidade de Aventuras com Cristo.",
        concluido: false,
      },
    ],
  },
  {
    categoria: "VII - Estudo da Natureza",
    itens: [
      {
        id: "exc_esn_1",
        texto:
          "Recapitular a história de Nicodemos e relacioná-la com o ciclo de vida da lagarta ou borboleta, acrescentando um significado espiritual.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esn_2",
        texto:
          "Completar uma especialidade de Estudos da Natureza, não realizada anteriormente.",
        concluido: false,
      },
    ],
  },
  {
    categoria: "VIII - Arte de Acampar",
    itens: [
      {
        id: "exc_aac_1",
        texto:
          "Com um grupo de, no mínimo quatro pessoas e com a presença de um conselheiro adulto e experiente, andar pelo menos 20 quilômetros numa área rural ou deserta, incluindo uma noite ao ar livre ou em barraca. Planejar a expedição em detalhes antes da saída. Durante a caminhada, efetuar anotações sobre o terreno, flora e fauna observados. Depois, usando as anotações, participar em uma discussão de grupo, dirigida por seu conselheiro.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_aac_2",
        texto: "Completar a especialidade de Pioneirias.",
        concluido: false,
      },
    ],
  },
  {
    categoria: "IX - Estilo de Vida",
    itens: [
      {
        id: "exc_esv_1",
        texto:
          "Completar uma especialidade, não realizada anteriormente, em uma das seguintes áreas:",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esv_1a",
        texto: "Atividades missionárias",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esv_1b",
        texto: "Atividades agrícolas",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esv_1c",
        texto: "Ciência e saúde",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "exc_esv_1d",
        texto: "Habilidades domésticas",
        somenteTexto: true,
        concluido: false,
      },
    ],
  },
];

interface Item {
  id: string;
  texto: string;
  permiteTexto?: boolean;
  somenteTexto?: boolean;
  concluido: boolean;
}

interface Categoria {
  categoria: string;
  itens: Item[];
}

export const guia: Categoria[] = [
  {
    categoria: "I - Requisitos Gerais",
    itens: [
      {
        id: "gui_ger_1",
        texto: "Ter, no mínimo, 15 anos de idade.",
        concluido: false,
      },
      {
        id: "gui_ger_2",
        texto: "Ser membro ativo do clube de Desbravadores.",
        concluido: false,
      },
      {
        id: "gui_ger_3",
        texto: "Memorizar e explicar o Voto de Fidelidade à Bíblia.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_ger_4",
        texto:
          "Ler o livro do Clube de Leitura Juvenil do ano em curso e resumi-lo em uma página.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_ger_5",
        texto: "Ler o livro 'O livro amargo'.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "II - Descoberta Espiritual",
    itens: [
      {
        id: "gui_esp_1",
        texto: "Memorizar e demonstrar o seu conhecimento: ",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esp_1a",
        texto: "3 mensagens Angélicas: Reveladas em Apocalipse 14:6-12",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esp_1b",
        texto: "7 Igrejas: O nome das igrejas do Apocalipse",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esp_1c",
        texto:
          "Pedras Preciosas: Os 12 fundamentos da Cidade Santa - A Nova Jerusalém",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esp_2",
        texto: "Ler e explicar os versos abaixo: ",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esp_2a",
        texto: "I Cor. 13",
        somenteTexto: true,
        concluido: false,
      },
      { id: "gui_esp_2b", texto: "II Cron. 7:14", concluido: false },
      { id: "gui_esp_2c", texto: "Apoc. 22:18-20", concluido: false },
      { id: "gui_esp_2d", texto: "II Tim. 4:6-7", concluido: false },
      { id: "gui_esp_2e", texto: "Rom. 8:38-39", concluido: false },
      { id: "gui_esp_2f", texto: "Mateus 6:33-34", concluido: false },
      {
        id: "gui_esp_3",
        texto:
          "Descrever os dons espirituais mencionados nos escritos de Paulo (Coríntios, Efésios, Filipenses) e para quais objetivos a igreja recebe estes dons.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esp_4",
        texto:
          "Estudar a estrutura e serviço do santuário no Antigo Testamento e relacionar com o ministério pessoal de Jesus e a cruz.",
        permiteTexto: true,
        concluido: false,
      },

      {
        id: "gui_esp_5",
        texto:
          "Ler e resumir três histórias de pioneiros adventistas. Contar essas histórias na reunião do clube, no culto JA ou na Escola Sabatina.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esp_6",
        texto: "Leitura bíblica: ",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esp_6a",
        texto:
          "Atos: 9:1-31, 9:32-43, 10, 11, 12, 13, 14, 16, 17:1-15, 17:16-34, 18, 19:1-22, 19:23-41, 20, 21:17-40; 22:1-16, 23, 24, 25, 26, 27, 28",
        concluido: false,
      },
      { id: "gui_esp_6b", texto: "Romanos: 12, 13, 14", concluido: false },
      { id: "gui_esp_6c", texto: "1 Coríntios: 13", concluido: false },
      {
        id: "gui_esp_6d",
        texto: "2 Coríntios: 5:11-21, 11:16-33; 12:1-10",
        concluido: false,
      },
      { id: "gui_esp_6e", texto: "Gálatas: 5:16-26; 6:1-10", concluido: false },
      { id: "gui_esp_6f", texto: "Efésios: 5:1-21, 6", concluido: false },
      { id: "gui_esp_6g", texto: "Filipenses: 4", concluido: false },
      { id: "gui_esp_6h", texto: "Colossenses: 3", concluido: false },
      {
        id: "gui_esp_6i",
        texto: "1 Tessalonicenses: 4:13-18, 5",
        concluido: false,
      },
      { id: "gui_esp_6j", texto: "2 Tessalonicenses: 2, 3", concluido: false },
      {
        id: "gui_esp_6k",
        texto: "1 Timóteo: 4:6-16, 5:1-16; 6:11-21",
        concluido: false,
      },
      { id: "gui_esp_6l", texto: "2 Timóteo: 2, 3", concluido: false },
      { id: "gui_esp_6m", texto: "Filemom", concluido: false },
      { id: "gui_esp_6n", texto: "Hebreus: 11", concluido: false },
      { id: "gui_esp_6o", texto: "Tiago: 1, 3, 5:7-20", concluido: false },
      { id: "gui_esp_6p", texto: "1 Pedro: 1, 5:1-11", concluido: false },
      { id: "gui_esp_6q", texto: "2 Pedro: 3", concluido: false },
      { id: "gui_esp_6r", texto: "1 João: 2, 3, 4, 5", concluido: false },
      { id: "gui_esp_6s", texto: "Judas: 1:17-25", concluido: false },
      {
        id: "gui_esp_6t",
        texto: "Apocalipse: 1, 2, 3, 7:9-17, 12, 13, 14, 19, 20, 21",
        concluido: false,
      },
    ],
  },
  {
    categoria: "III - Servindo a Outros",
    itens: [
      {
        id: "gui_out_1",
        texto:
          "Ajudar a organizar e participar em uma das seguintes atividades: ",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_out_1a",
        texto: "Fazer uma visita de cortesia a uma pessoa doente",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_out_1b",
        texto: "Adotar uma pessoa ou família em necessidade e ajudá-los",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_out_1c",
        texto: "Um projeto de sua escolha aprovado por seu líder",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_out_2",
        texto:
          "Discutir com sua unidade os métodos de evangelismo pessoal e colocar alguns princípios em prática.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "IV - Desenvolvendo Amizade",
    itens: [
      {
        id: "gui_des_1",
        texto:
          "Assistir a uma palestra ou aula e examinar suas atitudes em relação a dois dos seguintes temas: ",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_des_1a",
        texto: "A Importância da escolha profissional",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_des_1b",
        texto: "Como se relacionar com os pais",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_des_1c",
        texto: "A escolha da pessoa certa para namorar",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_des_1d",
        texto: "O plano de Deus para o sexo",
        somenteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "V - Saúde e Aptidão Física",
    itens: [
      {
        id: "gui_saf_1",
        texto:
          "Fazer uma apresentação, para alunos do ensino fundamental, sobre os oito remédios naturais dados por Deus.",
        permiteTexto: true,
        concluido: false,
      },

      {
        id: "gui_saf_2",
        texto: "Completar uma das seguintes atividades: ",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_saf_2a",
        texto:
          "Escrever uma poesia ou artigo sobre saúde para ser divulgado em uma revista, boletim ou jornal da igreja",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_saf_2b",
        texto:
          "Individualmente ou em grupo, organizar e participar em uma corrida ou atividade similar e apresentar com antecedência um programa de treinamento físico para este evento",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_saf_2c",
        texto:
          "Ler as páginas 102-125 do livro 'Temperança', de Ellen White, e apresentar em uma página ou mais, 10 textos selecionados da leitura",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_saf_2d",
        texto:
          "Completar a especialidade de Nutrição ou liderar um grupo para a especialidade de Cultura física",
        somenteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "VI - Organização e Liderança",
    itens: [
      {
        id: "gui_oli_1",
        texto:
          "Preparar um organograma da estrutura administrativa da Igreja Adventista em sua Divisão.",
        permiteTexto: true,
        concluido: false,
      },

      {
        id: "gui_oli_2",
        texto: "Participar em um dos itens abaixo: ",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_oli_2a",
        texto: "Curso para conselheiros",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_oli_2b",
        texto: "Convenção de liderança da Associação/Missão",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_oli_2c",
        texto: "2 reuniões de diretoria de seu clube",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_oli_3",
        texto:
          "Planejar e ensinar, no mínimo, dois requisitos de uma especialidade para um grupo de desbravadores.",
        permiteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "VII - Estudo da Natureza",
    itens: [
      {
        id: "gui_esn_1",
        texto:
          "Ler o capitulo 7 do livro 'O Desejado de Todas as Nações' sobre a infância de Jesus. Apresentar para um grupo, clube ou unidade as lições encontradas, demonstrando a importância que o estudo da natureza exerceu na educação e no ministério de Jesus.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esn_2",
        texto: "Completar uma das seguintes especialidades: ",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esn_2a",
        texto: "Ecologia",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esn_2b",
        texto: "Conservação Ambiental",
        somenteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "VIII - Arte de Acampar",
    itens: [
      {
        id: "gui_aac_1",
        texto:
          "Participar com sua unidade de um acampamento com estrutura de pioneiria, planejar o que deve ser levado e o que vai acontecer neste acampamento.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_aac_2",
        texto: "Planejar, preparar e cozinhar três refeições ao ar livre.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_aac_3",
        texto:
          "Construir e utilizar um móvel de acampamento em tamanho real, com nós e amarras.",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_aac_4",
        texto:
          "Completar uma especialidade, não realizada anteriormente, que possa ser contada para um dos Mestrados abaixo: ",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_aac_4a",
        texto: "Aquática",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_aac_4b",
        texto: "Esportes",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_aac_4c",
        texto: "Atividades Recreativas",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_aac_4d",
        texto: "Vida Campestre",
        somenteTexto: true,
        concluido: false,
      },
    ],
  },
  {
    categoria: "IX - Estilo de Vida",
    itens: [
      {
        id: "gui_esv_1",
        texto:
          "Completar uma especialidade, não realizada anteriormente, em alguma das seguintes áreas: ",
        permiteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esv_1a",
        texto: "Atividades agrícolas",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esv_1b",
        texto: "Ciência e saúde",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esv_1c",
        texto: "Habilidades domésticas",
        somenteTexto: true,
        concluido: false,
      },
      {
        id: "gui_esv_1d",
        texto: "Atividades profissionais",
        somenteTexto: true,
        concluido: false,
      },
    ],
  },
];
