// Botões e elementos principais
const abrir = document.getElementById("abrirPainel");
const adicionar = document.getElementById("adicionar");

// Cria modal de edição com histórico e nova atualização
const modalEditar = document.createElement("div");
modalEditar.id = "modalEditar";
modalEditar.className = "modal";
modalEditar.innerHTML = `
  <div class="modal-content" style="display:flex; gap:10px; max-width:800px; margin:auto; position:relative;">
    <span class="closeEditar" style="position:absolute; top:10px; right:15px; cursor:pointer;">&times;</span>
    
    <!-- Lado esquerdo: histórico -->
    <div id="historicoEditar" style="flex:1; border-right:1px solid #ccc; padding:10px;">
      <h3>Histórico de Conversas</h3>
    </div>

    <!-- Lado direito: nova atualização -->
    <div style="flex:1; padding:10px;">
      <h3>Nova Atualização</h3>
      <textarea id="novaAtualizacaoEditar" style="width:100%; height:150px;"></textarea>
      <button id="btnSalvarEditar">Salvar</button>
    </div>
  </div>
`;
document.body.appendChild(modalEditar);

// Variável global para guardar o card sendo editado
let cardAtual;

// Fechar modal editar
modalEditar.querySelector(".closeEditar").onclick = () => modalEditar.style.display = "none";
modalEditar.addEventListener("click", e => {
  if (e.target === modalEditar) modalEditar.style.display = "none";
});

// Função para abrir modal de edição
function abrirModalEditar(card) {
  cardAtual = card;
  modalEditar.style.display = "flex";

  const historico = document.getElementById("historicoEditar");
  historico.innerHTML = "<h3>Histórico de Conversas</h3>"; // limpa histórico

  // Pegar histórico do próprio card
  const conversas = card.dataset.conversas ? JSON.parse(card.dataset.conversas) : [];
  conversas.forEach(c => {
    const div = document.createElement("div");
    div.textContent = `${c.usuario}: ${c.mensagem}`;
    div.style.borderBottom = "1px solid #ddd";
    div.style.padding = "5px 0";
    historico.appendChild(div);
  });
}

// Salvar nova atualização
document.getElementById("btnSalvarEditar").addEventListener("click", () => {
  const msg = document.getElementById("novaAtualizacaoEditar").value.trim();
  if (!msg) return alert("Digite uma mensagem!");

  const novaConversa = { usuario: "Você", mensagem: msg };

  // Atualiza o dataset do card
  let conversas = cardAtual.dataset.conversas ? JSON.parse(cardAtual.dataset.conversas) : [];
  conversas.push(novaConversa);
  cardAtual.dataset.conversas = JSON.stringify(conversas);

  // Adiciona ao histórico no modal
  const historico = document.getElementById("historicoEditar");
  const div = document.createElement("div");
  div.textContent = `${novaConversa.usuario}: ${novaConversa.mensagem}`;
  div.style.borderBottom = "1px solid #ddd";
  div.style.padding = "5px 0";
  historico.appendChild(div);

  // Atualiza "Última atualização" do card no Kanban
  const ultimaAtualizacao = new Date().toLocaleString("pt-BR");
  cardAtual.querySelectorAll("p")[4].innerHTML = `<strong>Última atualização:</strong> ${ultimaAtualizacao}`;

  // Limpa textarea, mas não fecha o modal
  document.getElementById("novaAtualizacaoEditar").value = "";
});

// Função para carregar o conteúdo do modal de criação
function carregarModal(dados = null, cardRef = null) {
  const requisicao = new XMLHttpRequest();
  requisicao.open("GET", "Adicionar.html", true);
  requisicao.onreadystatechange = function () {
    if (requisicao.readyState === 4 && requisicao.status === 200) {
      adicionar.innerHTML = requisicao.responseText;
      adicionar.style.display = "flex";

      const fecharBtn = adicionar.querySelector("#fechar");
      fecharBtn.addEventListener("click", () => adicionar.style.display = "none");

      const form = adicionar.querySelector("#form-protocolo");
      if (form) {
        if (dados) {
          form.querySelector("#nomeProtocolo").value = dados.nomeProtocolo;
          form.querySelector("#solicitante").value = dados.solicitante;
          form.querySelector("#dataCriacao").value = dados.dataCriacao;
          form.querySelector("#dataFinal").value = dados.dataFinal;
          form.querySelector("#descricao").value = dados.descricao;
        }

        form.addEventListener("submit", (e) => {
          e.preventDefault();
          if (dados && cardRef) atualizarCard(cardRef);
          else criarCard();
          adicionar.style.display = "none";
        });
      }
    }
  };
  requisicao.send();
}

// Abrir modal criação
abrir.addEventListener("click", () => carregarModal());

// Criar card no Kanban
function criarCard() {
  const nomeProtocolo = document.getElementById("nomeProtocolo").value;
  const solicitante = document.getElementById("solicitante").value;
  const dataCriacao = document.getElementById("dataCriacao").value;
  const dataFinal = document.getElementById("dataFinal").value;
  const descricao = document.getElementById("descricao").value;
  const ultimaAtualizacao = new Date().toLocaleString("pt-BR");

  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("draggable", "true");

  card.innerHTML = `
    <div class="card-header">
      <h3>${nomeProtocolo}</h3>
      <button class="menu-btn">⋮</button>
    </div>
    <p><strong>Solicitante:</strong> ${solicitante}</p>
    <p><strong>Criado em:</strong> ${dataCriacao}</p>
    <p><strong>Finaliza em:</strong> ${dataFinal || "—"}</p>
    <p><strong>Descrição:</strong> ${descricao}</p>
    <p><strong>Última atualização:</strong> ${ultimaAtualizacao}</p>
    <div class="status-container">
      <label>Status:</label>
      <select class="status-select">
        <option value="nao-iniciado" selected>Não iniciado</option>
        <option value="em-andamento">Em andamento</option>
        <option value="finalizado">Finalizado</option>
      </select>
    </div>
  `;

  document.querySelector("#nao-iniciado .cards").appendChild(card);
  adicionarDragDrop(card);

  // Atualizar status
  card.querySelector(".status-select").addEventListener("change", (e) => {
    const novoStatus = e.target.value;
    document.querySelector(`#${novoStatus} .cards`).appendChild(card);
  });

  // Abrir modal de detalhes
  card.querySelector(".menu-btn").addEventListener("click", () => {
    const dados = {
      nomeProtocolo,
      solicitante,
      dataCriacao,
      dataFinal,
      descricao,
      ultimaAtualizacao
    };
    abrirModalDetalhes(dados, card);
  });
}

// Atualizar card existente
function atualizarCard(card) {
  const nomeProtocolo = document.getElementById("nomeProtocolo").value;
  const solicitante = document.getElementById("solicitante").value;
  const dataCriacao = document.getElementById("dataCriacao").value;
  const dataFinal = document.getElementById("dataFinal").value;
  const descricao = document.getElementById("descricao").value;
  const ultimaAtualizacao = new Date().toLocaleString("pt-BR");

  card.querySelector("h3").textContent = nomeProtocolo;
  const p = card.querySelectorAll("p");
  p[0].innerHTML = `<strong>Solicitante:</strong> ${solicitante}`;
  p[1].innerHTML = `<strong>Criado em:</strong> ${dataCriacao}`;
  p[2].innerHTML = `<strong>Finaliza em:</strong> ${dataFinal || "—"}`;
  p[3].innerHTML = `<strong>Descrição:</strong> ${descricao}`;
  p[4].innerHTML = `<strong>Última atualização:</strong> ${ultimaAtualizacao}`;
}

// Modal de detalhes
function abrirModalDetalhes(dados, cardRef) {
  let modalDetalhes = document.getElementById("modalDetalhes");
  if (!modalDetalhes) {
    modalDetalhes = document.createElement("div");
    modalDetalhes.id = "modalDetalhes";
    modalDetalhes.classList.add("modal-detalhes");
    document.body.appendChild(modalDetalhes);
  }

  modalDetalhes.innerHTML = `
    <div class="conteudo-modal">
      <span class="fechar-modal">&times;</span>
      <h2>${dados.nomeProtocolo}</h2>
      <div class="info-detalhes">
        <p><strong>Solicitante:</strong> ${dados.solicitante}</p>
        <p><strong>Criado em:</strong> ${dados.dataCriacao}</p>
        <p><strong>Finaliza em:</strong> ${dados.dataFinal || "—"}</p>
        <p><strong>Descrição:</strong> ${dados.descricao}</p>
        <p><strong>Última atualização:</strong> ${dados.ultimaAtualizacao}</p>
      </div>
      <div class="acoes-modal">
        <button class="editar-btn">✏️ Editar</button>
        <button class="excluir-btn">🗑️ Excluir</button>
      </div>
    </div>
  `;

  modalDetalhes.style.display = "flex";

  // Fechar
  modalDetalhes.querySelector(".fechar-modal").onclick = () => modalDetalhes.style.display = "none";
  modalDetalhes.addEventListener("click", e => { if (e.target === modalDetalhes) modalDetalhes.style.display = "none"; });

  // Excluir
  modalDetalhes.querySelector(".excluir-btn").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja excluir este protocolo?")) {
      cardRef.remove();
      modalDetalhes.style.display = "none";
    }
  });

  // Editar
  modalDetalhes.querySelector(".editar-btn").addEventListener("click", () => {
    modalDetalhes.style.display = "none";
    abrirModalEditar(cardRef);
  });
}

let listaFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];


// Drag & Drop
function adicionarDragDrop(card) {
  card.addEventListener("dragstart", () => card.classList.add("arrastando"));
  card.addEventListener("dragend", () => card.classList.remove("arrastando"));
}

document.querySelectorAll(".coluna .cards").forEach(coluna => {
  coluna.addEventListener("dragover", e => {
    e.preventDefault();
    const card = document.querySelector(".arrastando");
    if (card) coluna.appendChild(card);
  });
});
