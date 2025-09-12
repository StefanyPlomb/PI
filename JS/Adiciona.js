// Pega elementos
const abrir = document.getElementById("abrirPainel");
const fechar = document.getElementById("fechar");
const adicionar = document.getElementById("adicionar");

// Ao clicar no botão -> mostra o painel
abrir.addEventListener("click", () => {
  adicionar.style.display = "flex";
  carregarModal(); // Carrega o conteúdo do modal
});

// Ao clicar no X -> esconde o painel
fechar.addEventListener("click", () => {
  adicionar.style.display = "none";
});

// Função para carregar o conteúdo de acoes.html
function carregarModal() {
    const requisicaoModalAcoes = new XMLHttpRequest();
    requisicaoModalAcoes.open("GET", "Adicionar.html", true);
    requisicaoModalAcoes.onreadystatechange = function () {
        if (requisicaoModalAcoes.readyState === 4 && requisicaoModalAcoes.status === 200) {
            // Remove o conteúdo antigo da div #adicionar
            adicionar.innerHTML = requisicaoModalAcoes.responseText;

            // Adiciona o evento de fechar ao X
            const fecharBtn = adicionar.querySelector("#fechar");
            fecharBtn.addEventListener("click", () => {
                adicionar.style.display = "none";
            });

            // Mostra o modal
            adicionar.style.display = "flex";
        }
    };
    requisicaoModalAcoes.send();
}