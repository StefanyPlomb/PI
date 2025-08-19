// Pega elementos
const abrir = document.getElementById("abrirPainel");
const fechar = document.getElementById("fechar");
const adicionar = document.getElementById("adicionar");

// Ao clicar no botão -> mostra o painel
abrir.addEventListener("click", () => {
  adicionar.style.display = "flex";
});

// Ao clicar no X -> esconde o painel
fechar.addEventListener("click", () => {
  adicionar.style.display = "none";
});
