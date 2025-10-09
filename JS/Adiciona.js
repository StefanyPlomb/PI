// Botões e elementos principais
const abrir = document.getElementById("abrirPainel");
const adicionar = document.getElementById("adicionar");

// Função para carregar o conteúdo do modal
function carregarModal() {
  const requisicao = new XMLHttpRequest();
  requisicao.open("GET", "Adicionar.html", true);
  requisicao.onreadystatechange = function () {
    if (requisicao.readyState === 4 && requisicao.status === 200) {
      adicionar.innerHTML = requisicao.responseText;
      adicionar.style.display = "flex";

      // Botão de fechar
      const fecharBtn = adicionar.querySelector("#fechar");
      fecharBtn.addEventListener("click", () => {
        adicionar.style.display = "none";
      });

      // Captura o botão salvar dentro do modal
      const form = adicionar.querySelector("#form-protocolo");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          criarCard();
          adicionar.style.display = "none"; // fecha o modal
        });
      }
    }
  };
  requisicao.send();
}

// Exibe o painel ao clicar no "+"
abrir.addEventListener("click", carregarModal);

// Função para criar o card no Kanban
function criarCard() {
  const nomeProtocolo = document.getElementById("nomeProtocolo").value;
  const solicitante = document.getElementById("solicitante").value;
  const dataCriacao = document.getElementById("dataCriacao").value;
  const dataFinal = document.getElementById("dataFinal").value;
  const descricao = document.getElementById("descricao").value;
  const ultimaAtualizacao = new Date().toLocaleString("pt-BR");

  // Cria o elemento do card
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("draggable", "true");

  card.innerHTML = `
    <h3>${nomeProtocolo}</h3>
    <p><strong>Solicitante:</strong> ${solicitante}</p>
    <p><strong>Criado em:</strong> ${dataCriacao}</p>
    <p><strong>Finaliza em:</strong> ${dataFinal || "—"}</p>
    <p><strong>Descrição:</strong> ${descricao}</p>
    <p><strong>Última atualização:</strong> ${ultimaAtualizacao}</p>
    <div class="status-container">
      <label for="status">Status:</label>
      <select class="status-select">
        <option value="nao-iniciado" selected>Não iniciado</option>
        <option value="em-andamento">Em andamento</option>
        <option value="urgente">Urgente</option>
        <option value="finalizado">Finalizado</option>
      </select>
    </div>
  `;

  // Adiciona o card na coluna "Não iniciado"
  document.querySelector("#nao-iniciado .cards").appendChild(card);

  // Evento para alterar o status do card via select
  const selectStatus = card.querySelector(".status-select");
  selectStatus.addEventListener("change", (e) => {
    const novoStatus = e.target.value;
    document.querySelector(`#${novoStatus} .cards`).appendChild(card);
  });

  // Eventos para drag and drop (opcional)
  adicionarDragDrop(card);
}

// Função de drag & drop dos cards
function adicionarDragDrop(card) {
  card.addEventListener("dragstart", () => {
    card.classList.add("arrastando");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("arrastando");
  });
}

// Permite soltar os cards nas colunas
const colunas = document.querySelectorAll(".coluna .cards");
colunas.forEach((coluna) => {
  coluna.addEventListener("dragover", (e) => {
    e.preventDefault();
    const card = document.querySelector(".arrastando");
    coluna.appendChild(card);
  });
});
