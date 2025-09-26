let tamanhoFonte = 16;
 
document.addEventListener("DOMContentLoaded", () => {
  const btnAcess = document.getElementById("btn-acess");
  const painel = document.getElementById("painel");
  const btnContraste = document.getElementById("btn-contraste");
  const btnDyslexia = document.getElementById("btn-dyslexia");
 
  // Inicia com painel escondido
  painel.style.display = "none";
 
  // Alterna mostrar/ocultar painel
  btnAcess.onclick = () => {
    if (painel.style.display === "none" || painel.style.display === "") {
      painel.style.display = "flex";
      painel.style.flexDirection = "column";
    } else {
      painel.style.display = "none";
    }
  };
 
  // Alternar alto contraste
  btnContraste.onclick = () => {
    document.body.classList.toggle("alto-contraste");
  };
 
  // Alternar fonte legível para dislexia
  btnDyslexia.onclick = () => {
    document.body.classList.toggle("fonte-dyslexia");
  };
});
 
// Função global para ajustar tamanho da fonte
function ajustarFonte(delta) {
  tamanhoFonte = Math.min(24, Math.max(12, tamanhoFonte + delta));
  document.body.style.fontSize = tamanhoFonte + "px";
}