const cardsGrid = document.getElementById("cardsGrid");
const searchInput = document.getElementById("searchInput");
const noFavorites = document.getElementById("noFavorites");

// Simula favoritos (dados estáticos para testes)
const favoritos = [
  {
    id: 1,
    titulo: "Protocolo 1234",
    descricao: "Descrição breve do protocolo em andamento..."
  },
  {
    id: 2,
    titulo: "Protocolo 5678",
    descricao: "Outro protocolo marcado como favorito."
  },
  // Adicione mais objetos aqui se quiser
];

// Função para renderizar os cards
function renderCards(lista) {
  cardsGrid.innerHTML = "";

  if (lista.length === 0) {
    noFavorites.style.display = "block";
    return;
  }

  noFavorites.style.display = "none";

  lista.forEach(card => {
    const cardHTML = document.createElement("article");
    cardHTML.classList.add("card");

    cardHTML.innerHTML = `
      <h3>${card.titulo}</h3>
      <p>${card.descricao}</p>
      <svg class="star-favorite" viewBox="0 0 24 24" title="Remover dos favoritos">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2
                 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    `;

    // Evento de clique para "remover" favorito
    cardHTML.querySelector(".star-favorite").addEventListener("click", () => {
      removerFavorito(card.id);
    });

    cardsGrid.appendChild(cardHTML);
  });
}

// Função para remover (simulado) um favorito
function removerFavorito(id) {
  const index = favoritos.findIndex(card => card.id === id);
  if (index !== -1) {
    favoritos.splice(index, 1);
    renderCards(filtrar(searchInput.value));
  }
}

// Função de filtro por texto
function filtrar(termo) {
  return favoritos.filter(card =>
    card.titulo.toLowerCase().includes(termo.toLowerCase()) ||
    card.descricao.toLowerCase().includes(termo.toLowerCase())
  );
}

// Evento para busca
searchInput.addEventListener("input", () => {
  const termo = searchInput.value;
  renderCards(filtrar(termo));
});

// Renderiza inicialmente
renderCards(favoritos);
