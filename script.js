
const perfis = [
  {
    id: 1,
    nome: "Comandante de missão",
    categoria: "liderança",
    descricao: "liderar e proteger a civilização,",
    imagem: "imagens/img.1.jpg",
    missão: "Sua missão é liderar a equipe de astronautas e tomar decisões em situações de risco.",
  },
  {
    id: 2,
    nome: "Chefe de exploração",
    categoria: "Exploração",
    descricao: "Está conectado à descoberta, à observação e à preservação do mundo ao seu redor.",
    imagem: "imagens/img.2.jpg",
    recomendacao: "Sua missão é explorar um lugar novo, observar o ambiente e planejar uma pequena ação que ajudara a humanidade."
  },
  {
    id: 3,
    nome: "Major Galáxia",
    categoria: "Especialista",
    descricao: "Mestre em teclonogias avançadas",
    imagem: "imagens/img.3.jpg",
    recomendacao: "Manter e evoluir tecnologias, em prol da humanidade."
  },
  {
    id: 4,
    nome: "Piloto chefe",
    categoria: "Piloto de navegação",
    descricao: "Experiente e calmo, pronto para qualquer situação inesperada.",
    imagem: "imagens/img.4.jpg",
    recomendacao: "navegar além dos limites em busca da evolução."
  }
];

const perguntas = [
  {
    texto: "1. Qual desafio mais desperta sua curiosidade?",
    opcoes: [
      { texto: "Resolver um problema complexo", perfil: 1 },
      { texto: "Explorar um lugar desconhecido", perfil: 2 },
      { texto: "Criar algo totalmente novo", perfil: 3 },
      { texto: "Ajudar alguém a superar um desafio", perfil: 4 }
    ]
  },
  {
    texto: "2. Como você prefere trabalhar?",
    opcoes: [
      { texto: "Planejando e organizando soluções", perfil: 1 },
      { texto: "Observando e experimentando", perfil: 2 },
      { texto: "Imaginando novas possibilidades", perfil: 3 },
      { texto: "Colaborando com outras pessoas", perfil: 4 }
    ]
  },
  {
    texto: "3. Qual habilidade representa você?",
    opcoes: [
      { texto: "Lógica e estratégia", perfil: 1 },
      { texto: "Curiosidade e observação", perfil: 2 },
      { texto: "Imaginação e expressão", perfil: 3 },
      { texto: "Empatia e comunicação", perfil: 4 }
    ]
  },
  {
    texto: "4. Qual missão você escolheria?",
    opcoes: [
      { texto: "Construir uma solução útil", perfil: 1 },
      { texto: "Descobrir e proteger novos ambientes", perfil: 2 },
      { texto: "Dar vida a uma grande ideia", perfil: 3 },
      { texto: "Unir pessoas por uma causa", perfil: 4 }
    ]
  }
];

const form = document.getElementById("quizForm");
const perguntasContainer = document.getElementById("perguntas");
const resultado = document.getElementById("resultado");
const nascimentoInput = document.getElementById("nascimento");

// Impede a seleção de uma data futura.
const hojeISO = () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

nascimentoInput.max = hojeISO();

// Gera as quatro perguntas a partir dos dados JavaScript.
perguntas.forEach((pergunta, indice) => {
  const bloco = document.createElement("fieldset");
  bloco.className = "question";
  bloco.style.border = "0";
  bloco.style.marginInline = "0";
  bloco.style.paddingInline = "0";

  const titulo = document.createElement("legend");
  titulo.className = "question-title";
  titulo.textContent = pergunta.texto;
  bloco.appendChild(titulo);

  const opcoes = document.createElement("div");
  opcoes.className = "options";

  pergunta.opcoes.forEach((opcao, numero) => {
    const label = document.createElement("label");
    label.className = "option";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = `pergunta${indice + 1}`;
    radio.value = String(opcao.perfil);
    radio.required = numero === 0;

    const texto = document.createElement("span");
    texto.textContent = opcao.texto;

    label.append(radio, texto);
    opcoes.appendChild(label);
  });

  bloco.appendChild(opcoes);
  perguntasContainer.appendChild(bloco);
});

// Calcula a idade levando em conta o dia e o mês do aniversário.
function calcularIdade(dataNascimento) {
  const [ano, mes, dia] = dataNascimento.split("-").map(Number);
  const hoje = new Date();

  let idade = hoje.getFullYear() - ano;

  const aniversarioAindaNaoOcorreu =
    hoje.getMonth() + 1 < mes ||
    (hoje.getMonth() + 1 === mes && hoje.getDate() < dia);

  if (aniversarioAindaNaoOcorreu) {
    idade--;
  }

  return idade;
}

function exibirResultado(html) {
  resultado.innerHTML = html;
  resultado.classList.remove("hidden");
  resultado.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!form.reportValidity()) return;

  const nome = document.getElementById("nome").value.trim();
  const nascimento = nascimentoInput.value;

  if (!nome || !nascimento) {
    alert("Preencha seu nome e sua data de nascimento.");
    return;
  }

  // Validação adicional, independente do limite do campo date.
  const dataInformada = new Date(`${nascimento}T12:00:00`);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (
    Number.isNaN(dataInformada.getTime()) ||
    dataInformada > hoje ||
    calcularIdade(nascimento) < 0
  ) {
    alert("Informe uma data de nascimento válida, que não seja futura.");
    nascimentoInput.focus();
    return;
  }

  const idade = calcularIdade(nascimento);
  const pontuacao = [0, 0, 0, 0, 0];

  perguntas.forEach((pergunta, indice) => {
    const resposta = form.querySelector(
      `input[name="pergunta${indice + 1}"]:checked`
    );

    if (resposta) {
      pontuacao[Number(resposta.value)]++;
    }
  });

  const maiorPontuacao = Math.max(...pontuacao.slice(1));
  const vencedores = perfis.filter(
    perfil => pontuacao[perfil.id] === maiorPontuacao
  );

  const saudacao = `
    <p>Olá, <strong>${escaparHTML(nome)}</strong>! Você tem
    <strong>${idade} anos</strong>.</p>
  `;

  if (vencedores.length > 1) {
    const nomes = vencedores
      .map(perfil => escaparHTML(perfil.nome))
      .join(", ");

    exibirResultado(`
      <span class="profile-category">RESULTADO DA MISSÃO</span>
      <h2>Sua aura é multifacetada </h2>
      ${saudacao}
      <p>Suas respostas revelaram um empate entre estes perfis:</p>
      <p><strong>${nomes}</strong></p>
      <p>Você combina características de diferentes missões.
      Explore cada uma delas para descobrir qual mais combina com você.</p>
      <button type="button" class="primary-btn" id="refazer">
        Refazer o teste ↻
      </button>
    `);
  } else {
    // Busca os dados completos no array de objetos.
    const perfil = perfis.find(
      item => item.id === vencedores[0].id
    );

    exibirResultado(`
      <span class="profile-category">
        ${escaparHTML(perfil.categoria)}
      </span>
      <h2>${escaparHTML(perfil.nome)}</h2>
      ${saudacao}
      <img
        class="result-image"
        src="${escaparHTML(perfil.imagem)}"
        alt="Ilustração do perfil ${escaparHTML(perfil.nome)}"
        onerror="this.style.display='none'"
      >
      <h3>Seu perfil</h3>
      <p>${escaparHTML(perfil.descricao)}</p>
      <div class="recommendation">
        <strong> Sua próxima missão</strong>
        <p>${escaparHTML(perfil.recomendacao)}</p>
      </div>
      <button type="button" class="primary-btn" id="refazer">
        Refazer o teste ↻
      </button>
    `);
  }

  document.getElementById("refazer").addEventListener("click", () => {
    form.reset();
    nascimentoInput.max = hojeISO();
    resultado.classList.add("hidden");
    resultado.innerHTML = "";
    document.getElementById("formPanel").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    document.getElementById("nome").focus({ preventScroll: true });
  });
});

// Evita inserir nomes e textos fornecidos pelo usuário como HTML.
function escaparHTML(valor) {
  return String(valor).replace(/[&<>"']/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caractere]);
}
