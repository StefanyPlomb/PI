// Obtém o botão para abrir o modal
const openModalButton = document.getElementById('open-modal-button');
// Obtém o elemento de sobreposição do modal
const modalOverlay = document.getElementById('login-modal-overlay');

// Adiciona um ouvinte de evento de clique ao botão com icone do usuário
openModalButton.addEventListener('click', () => {
    // Exibe a sobreposição do modal
    modalOverlay.style.display = 'flex';
});

// Adiciona um ouvinte de evento de clique à própria sobreposição para fechá-la
// quando o usuário clica fora do container do modal
modalOverlay.addEventListener('click', (event) => {
    // Verifica se o clique ocorreu diretamente na sobreposição, e não dentro do container do modal
    if (event.target === modalOverlay) {
        // Oculta a sobreposição do modal
        modalOverlay.style.display = 'none';
    }
});

// Variaveis pros botoes de login e registrar (pra facilitar pesquisa no ctrl+f)
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');

loginButton.addEventListener('click', () => {
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    // log pra ver se funciona
    console.log('Tentativa de login:');
    console.log('Usuário:', usuario);
    console.log('Senha:', password);
});

document.getElementById('register-button').addEventListener('click', function() {
    window.location.href = '../../cadastro-app/src/html/cadastro.html';
});

// JavaScript para o Carrossel

// Variáveis para o carrossel
const carousel = document.getElementById('funcionalidades-carousel');
const prevButton = document.getElementById('prev-slide');
const nextButton = document.getElementById('next-slide');
const carouselItems = document.querySelectorAll('.carrossel-item-estilo');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;

// Função para atualizar o carrossel
function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 50}%)`;
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Navegação com setas
prevButton.addEventListener('click', () => {
    // Resetar o timer ao clicar na seta
    clearInterval(autoRotationInterval);
    // Iniciar um novo timer
    const newInterval = setInterval(autoRotate, 5000);
    // Armazenar a referência do intervalo em uma variável global se necessário
    autoRotationInterval = newInterval;
    // Atualizar o carrossel
    currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
    updateCarousel();
});

nextButton.addEventListener('click', () => {
    // Resetar o timer ao clicar na seta
    clearInterval(autoRotationInterval);
    // Iniciar um novo timer
    const newInterval = setInterval(autoRotate, 5000);
    // Armazenar a referência do intervalo em uma variável global se necessário
    autoRotationInterval = newInterval;
    // Atualizar o carrossel
    currentIndex = (currentIndex + 1) % carouselItems.length;
    updateCarousel();
});

// Inicializa o carrossel
updateCarousel();

// Autorrrotação automática
function autoRotate() {
    currentIndex = (currentIndex + 1) % carouselItems.length;
    updateCarousel();
}

// Iniciar a rotação automática a cada 5 segundos
let autoRotationInterval = setInterval(autoRotate, 5000);

// Parar a rotação quando o usuário interagir com o carrossel
carousel.addEventListener('click', () => {
    clearInterval(autoRotationInterval);
});